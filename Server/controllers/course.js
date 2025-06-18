
export const createCourse = async (req, res) => {
    const { title, description, price, category, duration, createdBy } = req.body;

    const image = req.file;


}