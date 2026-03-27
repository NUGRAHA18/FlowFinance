import * as AnalyticsService from "../service/analytics.service.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const filter = req.query.filter || "this_month";
    const data = await AnalyticsService.getDashboardData(req.userId, filter);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
