const { Op } = require("sequelize");
const TaskMast = require("../models/TaskMast");
const Employee = require("../models/employee");
const ProjHelp = require("../models/projhelp");
const JobDetl = require("../models/JobDetl");
const { generateMISPDF } = require("../utils/misPdfGenerator");
const { computeSummary } = require("../utils/misSummary");

exports.misForMe = async (req, res) => {
  try {
    const userId = req.user.code;

    const tasks = await TaskMast.findAll({
      where: { JobTo: userId },
      include: [
        { model: Employee, as: "fromUser" },
        { model: Employee, as: "toUser" },
        { model: ProjHelp, as: "status" },
        { model: JobDetl, as: "job" }
      ]
    });

    const summaryData = { me: computeSummary(tasks) };

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=MIS-Me.pdf");

    const pdfStream = await generateMISPDF(summaryData, "MIS Report — Tasks Assigned To Me");
    pdfStream.pipe(res);
    pdfStream.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate MIS Report (Me)");
  }
};

exports.misForOthers = async (req, res) => {
  try {
    const userId = req.user.code;

    const tasks = await TaskMast.findAll({
      where: { JobTo: { [Op.ne]: userId } },
      include: [
        { model: Employee, as: "fromUser" },
        { model: Employee, as: "toUser" },
        { model: ProjHelp, as: "status" },
        { model: JobDetl, as: "job" }
      ]
    });

    const summaryData = { others: computeSummary(tasks) };

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=MIS-Others.pdf");

    const pdfStream = await generateMISPDF(summaryData, "MIS Report — Tasks Assigned To Others");
    pdfStream.pipe(res);
    pdfStream.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate MIS Report (Others)");
  }
};
