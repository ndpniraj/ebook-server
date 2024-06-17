import HistoryModel from "@/models/history";
import { UpdateHistoryRequestHandler } from "@/types";

export const updateBookHistory: UpdateHistoryRequestHandler = async (
  req,
  res
) => {
  const { book, highlights, lastLocation } = req.body;

  let history = await HistoryModel.findOne({
    book,
    reader: req.user.id,
  });

  if (!history) {
    history = new HistoryModel({
      reader: req.user.id,
      book,
      lastLocation,
      highlights,
    });
  } else {
    if (lastLocation) history.lastLocation = lastLocation;
    if (highlights?.length) history.highlights.push(...highlights);
  }

  await history.save();

  res.send();
};
