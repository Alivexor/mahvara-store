import { z } from "zod";
export const contactSchema=z.object({name:z.string().trim().min(2).max(100),email:z.email().transform(v=>v.toLowerCase().trim()),phone:z.string().trim().max(20).optional(),subject:z.string().trim().min(3).max(150),message:z.string().trim().min(15).max(3000),website:z.string().max(0).optional()});
