export async function getAllQuestions(req, res) {
  try {
    res.status(200).json({
      status: "success",
      data: "math questions",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
}
export async function getQuestion(req, res) {
  try {
    res.status(200).json({
      status: "success",
      data: "math question",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
}
export async function createQuestion(req, res) {
  try {
    res.status(201).json({
      status: "success",
      data: "math question created",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
}
