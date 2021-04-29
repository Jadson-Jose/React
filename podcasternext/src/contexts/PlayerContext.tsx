import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    tooglePlay: () => void;
    toogleLoop: () => void;
    toogleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean
}


export const PlayContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setcurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setcurrentEpisodeIndex(0);
        setIsPlaying(true)
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setcurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function tooglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toogleLoop() {
        setIsLooping(!isLooping)
    }

    function toogleShuffle() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setcurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) >= episodeList.length;

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
            setcurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {

            setcurrentEpisodeIndex(currentEpisodeIndex + 1)
        }
    }

    function playPrevious() {

        if (hasPrevious) {
            setcurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                playList,
                playNext,
                playPrevious,
                isPlaying,
                isLooping,
                isShuffling,
                tooglePlay,
                setPlayingState,
                hasNext,
                hasPrevious,
                toogleLoop,
                toogleShuffle,
                clearPlayerState,
            }}
        >
            {children}
        </PlayContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayContext);
}