import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import { GetStaticPaths, GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import episodesData from "../../data/server.json";
import styles from "./episode.module.scss";
import { api } from "../../services/api";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "../../context/PlayerContext";
import Head from "next/head";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button>
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
          alt={"Thumbnail"}
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>

      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: episode.description,
        }}
      />
    </div>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = episodesData.episodes.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const episode = episodesData.episodes.find((ep) => ep.id === slug);

  const formattedEpisode = {
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
      locale: ptBR,
    }),
    duration: Number(episode.file.duration),
    durationAsString: convertDurationToTimeString(
      Number(episode.file.duration)
    ),
    description: episode.description,
    url: episode.file.url,
  };

  return {
    props: {
      episode: formattedEpisode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
