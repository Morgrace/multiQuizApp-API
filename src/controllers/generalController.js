export async function getAllQuestions(req, res) {
  try {
    res.status(200).json({
      status: "success",
      data: "Hello world",
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
      data: "Hello world",
    });
  } catch (error) {
    res.send(404).json({
      status: "fail",
      message: error,
    });
  }
}
export async function createQuestion(req, res) {
  try {
    res.status(201).json({
      status: "success",
      data: "Hello World",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
}
export async function updateQuestion(req, res) {
  try {
    res.status(200).json({
      status: "success",
      data: "Hello world",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
}
export async function deleteQuestion(req, res) {
  try {
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
}
