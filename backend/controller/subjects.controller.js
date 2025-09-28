import { subjectModel } from "../models/subjects.model.js";

export const getSubjects = async (req, res) => {
    try {
        const { branch, semester } = req.query;
        if (!branch || !semester) {
            return res.status(400).json({ message: "Branch and semester are required" });
        }
        
       
        const subjects = await subjectModel.find({ branch: branch, semester: Number(semester) });
        
        res.status(200).json(subjects);
    } catch (error) { 
        console.error("Error fetching subjects:", error);
        res.status(500).json({ message: "Server error" });
    }
};
