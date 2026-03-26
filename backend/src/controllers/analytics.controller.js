import * as AnalyticsService from "../service/analytics.service.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const data = await AnalyticsService.getDashboardData(req.userId);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
