import { Check } from '@mui/icons-material';

export default function SelectedSpotOverlay(props: { spot: number }) {
  return (
    <div className="selected-spot-overlay">
      <div className="left">
        <div className="title">Spot {props.spot}</div>
        <div className="description">This spot is available.</div>
      </div>
      <div className="right">
        <div className="select-btn" onClick={() => (window.location.href = `/checkout/${props.spot}`)}>
          <Check fontSize="large" />
        </div>
      </div>
    </div>
  );
}
