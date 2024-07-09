import episodesData from "../../../data/server.json";

export default function handler(req, res) {
  const { _limit, _sort, _order } = req.query;

  let episodes = episodesData.episodes;

  if (_sort === "published_at") {
    episodes = episodes.sort((a, b) => {
      if (_order === "desc") {
        return new Date(b.published_at) - new Date(a.published_at);
      } else {
        return new Date(a.published_at) - new Date(b.published_at);
      }
    });
  }

  if (_limit) {
    episodes = episodes.slice(0, Number(_limit));
  }

  res.status(200).json(episodes);
}
