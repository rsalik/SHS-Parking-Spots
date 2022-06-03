export default function SelectedSpotOverlay(props: { spot: number }) {
  return (
    <div className="selected-spot-overlay">
      <div className="title">Spot {props.spot}</div>
      <div className="description">
        This spot is available.
      </div>
    </div>
  );
}
