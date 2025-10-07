import { z, treeifyError } from "zod";
const registrationSchema = z.object({
    name: z.string({error:"Name Required"}).min(3, { message: "Name Must be atleast 3 letters" }).transform((item) => item.trim()),
    email: z.email({error:"Email Required"}).transform((item) => item.trim()),
    mobile: z.string({ error: "Mobile Number required" }).min(10, { error: "Minimum 10 digts are required" }).max(10, { message: "Maximum 10 digts are required" }).transform((item) => item.trim()),
    password: z.string({error:"Password required"}).min(6, { message: "Password must atleast contail 6 haracters" }).transform((item) => item.trim())
})
export const registrationValidation = (req, res, next) => {
    const zodResponse = registrationSchema.safeParse(req.body);
    if (!zodResponse.success) {
        return res.status(400).json({
            error: treeifyError(zodResponse.error)
        })
    }
    const data = zodResponse.data;
    req.bodyData = data;
    next();
}