import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { products, blogPosts, categories as catalogCategories } from "../lib/catalog";

const prisma = new PrismaClient();
async function main(){
  const adminEmail=process.env.DEMO_ADMIN_EMAIL??"admin@mahvara.local";const customerEmail=process.env.DEMO_CUSTOMER_EMAIL??"customer@mahvara.local";
  const adminPassword=process.env.DEMO_ADMIN_PASSWORD??"ChangeMe123!";const customerPassword=process.env.DEMO_CUSTOMER_PASSWORD??"ChangeMe123!";
  if(process.env.NODE_ENV==="production"&&(!process.env.DEMO_ADMIN_PASSWORD||!process.env.DEMO_CUSTOMER_PASSWORD||adminPassword==="ChangeMe123!"||customerPassword==="ChangeMe123!"))throw new Error("Set unique DEMO_ADMIN_PASSWORD and DEMO_CUSTOMER_PASSWORD before seeding production.");
  const [admin,customer]=await Promise.all([
    prisma.user.upsert({where:{email:adminEmail},update:{role:"ADMIN",isActive:true},create:{email:adminEmail,phone:"09120000001",firstName:"مدیر",lastName:"ماه‌ورا",role:"ADMIN",passwordHash:await hash(adminPassword,12)}}),
    prisma.user.upsert({where:{email:customerEmail},update:{isActive:true},create:{email:customerEmail,phone:"09120000002",firstName:"سارا",lastName:"آزمایشی",passwordHash:await hash(customerPassword,12)}})
  ]);
  const categoryMap=new Map<string,string>();for(const item of catalogCategories){const row=await prisma.category.upsert({where:{slug:item.slug},update:{name:item.name,imageUrl:item.image,isActive:true},create:{name:item.name,slug:item.slug,imageUrl:item.image,description:item.caption,isActive:true}});categoryMap.set(item.slug,row.id)}
  const brandNames=Array.from(new Map(products.map(p=>[p.brandSlug,p.brand])).entries());const brandMap=new Map<string,string>();for(const [slug,name] of brandNames){const row=await prisma.brand.upsert({where:{slug},update:{name},create:{name,slug,isFeatured:["la-roche-posay","the-ordinary","nars","olaplex"].includes(slug)}});brandMap.set(slug,row.id)}
  for(const product of products){await prisma.product.upsert({where:{id:product.id},update:{name:product.name,price:product.price,salePrice:product.salePrice??null,status:"ACTIVE"},create:{id:product.id,name:product.name,slug:product.slug,sku:product.sku,shortDescription:product.shortDescription,description:product.description,ingredients:product.ingredients,usage:product.usage,warnings:product.warnings,skinTypes:product.skinTypes,productType:product.productType,price:product.price,salePrice:product.salePrice??null,status:"ACTIVE",isFeatured:product.isFeatured??false,isNew:product.isNew??false,seoTitle:product.name,seoDescription:product.shortDescription,categoryId:categoryMap.get(product.categorySlug)!,brandId:brandMap.get(product.brandSlug)!}});await prisma.inventory.upsert({where:{productId:product.id},update:{stock:product.stock,lowStockThreshold:5},create:{productId:product.id,stock:product.stock,lowStockThreshold:5}});await prisma.productImage.deleteMany({where:{productId:product.id}});await prisma.productImage.createMany({data:product.gallery.map((url,index)=>({productId:product.id,url,alt:`تصویر ${index+1} ${product.name}`,sortOrder:index}))})}
  await prisma.address.upsert({where:{id:"demo_address"},update:{},create:{id:"demo_address",userId:customer.id,title:"خانه",recipient:"سارا آزمایشی",phone:"09120000002",province:"تهران",city:"تهران",address:"خیابان نمونه، کوچه آزمایش، پلاک ۱۲",postalCode:"1234567890",isDefault:true}});
  await prisma.wishlist.upsert({where:{userId:customer.id},update:{},create:{userId:customer.id}});
  await prisma.coupon.upsert({where:{code:"ROUTINE15"},update:{isActive:true},create:{code:"ROUTINE15",type:"PERCENTAGE",value:15,minimumOrder:2_000_000,maximumDiscount:700_000,usageLimit:500,isActive:true}});
  await prisma.coupon.upsert({where:{code:"WELCOME200"},update:{isActive:true},create:{code:"WELCOME200",type:"FIXED",value:200_000,minimumOrder:1_200_000,usageLimit:500,isActive:true}});
  const blogCategory=await prisma.blogCategory.upsert({where:{slug:"beauty-guide"},update:{},create:{name:"راهنمای زیبایی",slug:"beauty-guide"}});
  for(const post of blogPosts)await prisma.blogPost.upsert({where:{slug:post.slug},update:{title:post.title,excerpt:post.excerpt},create:{title:post.title,slug:post.slug,excerpt:post.excerpt,content:post.excerpt,coverImage:post.image,authorName:"تحریریه ماه‌ورا",categoryId:blogCategory.id,tags:[post.category],isPublished:true,publishedAt:new Date("2026-06-01"),seoTitle:post.title,seoDescription:post.excerpt}});
  for(let index=0;index<6;index++){const product=products[index];await prisma.review.upsert({where:{productId_userId:{productId:product.id,userId:customer.id}},update:{status:"APPROVED"},create:{productId:product.id,userId:customer.id,rating:index%2?5:4,title:"تجربه خرید خوب",comment:"بافت محصول با توضیحات هم‌خوان بود و بسته‌بندی سالم به دستم رسید.",status:"APPROVED",isVerifiedPurchase:true}})}
  await prisma.banner.upsert({where:{id:"home_main"},update:{},create:{id:"home_main",title:"زیبایی، وقتی روشن انتخاب می‌شود",subtitle:"انتخاب‌های دقیق برای روتین روزانه",imageUrl:"/images/mahvara-hero.png",linkUrl:"/shop",position:"HOME_HERO",isActive:true}});
  await prisma.setting.upsert({where:{key:"store.identity"},update:{value:{name:"ماه‌ورا",currency:"IRT"}},create:{key:"store.identity",value:{name:"ماه‌ورا",currency:"IRT"}}});
  await prisma.auditLog.create({data:{actorId:admin.id,action:"DEMO_SEED_COMPLETED",entityType:"System",metadata:{products:products.length}}});
  console.log(`Seed complete: ${products.length} products, admin ${admin.email}, customer ${customer.email}`);
}
main().catch(error=>{console.error(error);process.exit(1)}).finally(async()=>prisma.$disconnect());
