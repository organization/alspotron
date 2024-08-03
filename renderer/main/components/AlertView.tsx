import { Trans } from '@jellybrick/solid-i18next';

import useServer from '../../hooks/useServer';
import { useClassStyle } from '../../hooks/useClassStyle';
import { userCSSSelectors } from '../../utils/userCSSSelectors';

export const AlertView = () => {
  const [state] = useServer();


  useClassStyle(userCSSSelectors.alert, () => `
    display: none;
    
    position: absolute;
    
    width: fit-content;
    height: fit-content;
    padding: 32px 64px;
    border-radius: 24px;
    
    z-index: 100;
  `);
  useClassStyle(userCSSSelectors['alert--disconnected'], () => `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.75);
    background-image: linear-gradient(
      135deg,
      rgba(255, 34, 34, 0.2) 25%,
      rgba(255, 34, 34, 0.1) 25%,
      rgba(255, 34, 34, 0.1) 50%,
      rgba(255, 34, 34, 0.2) 50%,
      rgba(255, 34, 34, 0.2) 75%,
      rgba(255, 34, 34, 0.1) 75%
    );
    background-size: 24px 24px;
    box-shadow: 0 0 0 4px rgba(255, 34, 34, 0.1) inset;
    
    animation: background 10s linear infinite;
  `);
  useClassStyle(userCSSSelectors['alert--description'], () => `
    text-wrap: balance;
    word-break: keep-all;
    text-align: center;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
  `);

  return (
    <div
      classList={{
        [userCSSSelectors.alert]: true,
        [userCSSSelectors['alert--disconnected']]: state() === 'close',
      }}
    >
      <Trans key={'lyrics.disconnected'}/>
      <span class={userCSSSelectors['alert--description']}>
        <Trans key={'lyrics.disconnected.description'}/>
      </span>
    </div>
  );
};
