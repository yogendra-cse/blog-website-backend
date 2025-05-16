import Report from "../models/reports.model.js"
export const reportPost = async (req, res) => {
  const { postId, username, message } = req.body;

  try {
    let report = await Report.findOne({ postId});    

    if (report) {
      report.reportMessages.push({ username, message });
      report.count += 1;
      await report.save();
    } else {
      report = new Report({
        postId,
        reportMessages: [{ username, message }],
        count: 1
      });
      await report.save();
    }

    res.status(200).json({ message: "Report submitted successfully." });
  } catch (err) {
    console.error("Report submission failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getReportedPosts = async (req, res) => {
  try {
    const reports = await Report.find().sort({ count: -1 }).populate("postId");
    res.status(200).json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Failed to delete report", err);
    res.status(500).json({ error: "Failed to delete report" });
  }
};