import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';

import { usePlayer } from '../../context/playerContext';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  /**
   * Quando se usa TS com HTML, todos os elementos ficam disponiveis de forma global
   * Dando acesso aos tipos e metodos que cada tag possui
   */
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    hasNext,
    hasPrevious,
    isShuffling, 
    togglePlay,
    setPlayState,
    playNext,
    toggleLoop,
    playPrevious,
    toggleShuffle,
    clearPlayerState 
  } = usePlayer();
/*******************************
 * Monitorar o estado isPlaying e realizar ação quando o valor dele mudar
 */
  useEffect(() => {
    if(!audioRef.current) {
      return;
    }
    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])
  
  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext();
    } else {
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
            width={592}
            height={592}
            src={episode.thumbnail}
            alt={episode.title}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider 
                trackStyle={{backgroundColor: '#04D361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{borderColor: '#04D361', borderWidth: 2}}
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setPlayState(true)} 
            onPause={() => setPlayState(false)}
            loop={isLooping}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}  
          />
        ) }

        <div className={styles.button}>
          <button
            type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={() => toggleShuffle()}
            className={isShuffling ? styles.isActive :""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton} 
            disabled={!episode}
            onClick={togglePlay}
            >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button 
            type="button" 
            disabled={!episode}
            onClick={() => toggleLoop()}
            className={isLooping ? styles.isActive :""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>

      </footer>
    </div>
  )
}