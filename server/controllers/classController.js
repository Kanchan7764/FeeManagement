import Class from "../models/Class.js";

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    // console.log(classes);

    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "get class server error"
    });
  }
};


const addClass = async (req, res) => {
  try {
    const { class_name, description } = req.body;
    const newClass = new Class({
      class_name,
      description,
    });
    await newClass.save();
    return res.status(200).json({ success: true, classData: newClass });
  } catch (error) {
    return res.status(500).json({ success: false, error: "add class error" });
  }
};

const getClass = async (req, res) => {
  try {
    const { id } = req.params;
    const cls = await Class.findById({ _id: id });
    return res.status(200).json({ success: true, cls });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get class server error" });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name, description } = req.body;
    const updateClass = await Class.findByIdAndUpdate(
      { _id: id },
      {
        class_name,
        description,
      }
    );
    return res.status(200).json({ success: true, updateClass });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "edit class server error" });
  }
};

const deleteClass= async(req, res)=>{
  try {
    const { id } = req.params;
    const deleteClass = await Class.findByIdAndDelete(
      { _id: id },
      
    );
    return res.status(200).json({ success: true, deleteClass });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "delete class server error" });
  }
}

export { addClass, getClasses, getClass, updateClass ,deleteClass};
