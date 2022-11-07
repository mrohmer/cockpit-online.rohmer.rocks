
export const handleBackLinkClick = ({detail: event}: any) => {
  if (document.referrer?.includes('rohmer.rocks') && new URL(document.referrer).host !== window.location.host) {
    event.preventDefault();

    history.back();

    return false;
  }
}
