import express from 'express';
import documents from "../docs.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
    const result = await documents.getAll();
    return res.json(result);
});

router.get("/:id", async (req, res) => {
    const result = await documents.getOne(req.params.id);
    return res.json(result);
});

router.post("/add_new", async (req, res) => {
    const result = await documents.addOne(req.body, req.auth._id);
    return res.json(result);
});

router.post("/update", async (req, res) => {
    const { _id, ...updateData } = req.body;
    const result = await documents.updateOne(_id, updateData);
    return res.json(result);
});

router.delete("/:id", async (req, res) => {
    const result = await documents.deleteOne(req.params.id);
    return res.json(result);
});

export default router;