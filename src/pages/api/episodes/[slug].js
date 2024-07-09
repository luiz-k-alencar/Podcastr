import episodesData from '../../../data/server.json';

export default function handler(req, res) {
  const { slug } = req.query;
  const episode = episodesData.episodes.find(ep => ep.id === slug);

  console.log('slug', slug);

  if (episode) {
    res.status(200).json(episode);
  } else {
    res.status(404).json({ message: 'Episode not found' });
  }
}
