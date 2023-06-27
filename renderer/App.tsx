import LyricProgressBar from './LyricProgressBar';
import LyricsItem from './LyricsItem';

const App = () => {
  return (
    <div class={`
      fixed bottom-8 right-8 w-fit h-fit
      flex flex-col justify-start items-end gap-4
    `}>
      <LyricsItem />
      <LyricsItem />
      <LyricProgressBar />
    </div>
  )
};

export default App;
