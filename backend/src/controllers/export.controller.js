import * as ExportService from "../service/export.service.js";

export const exportTransactions = async (req, res) => {
  try {
    const csv = await ExportService.exportTransactionsCSV(req.userId);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=transaksi-flowfinance.csv");
    // BOM untuk Excel agar baca UTF-8
    res.status(200).send("\uFEFF" + csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
