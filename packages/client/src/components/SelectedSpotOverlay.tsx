import { Check } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getTakenSpots } from '../map-data/apiHelper';

export default function SelectedSpotOverlay(props: { spot: number }) {
  let [taken, setTaken] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    getTakenSpots().then((res) => {
      setLoading(false);
      setTaken(res.includes(props.spot));
    });
  }, [props.spot]);

  return (
    <div className="selected-spot-overlay">
      <div className="left">
        <div className="title">Spot {props.spot}</div>
        <div className="description">{loading ? 'Loading...' : taken ? 'This spot is taken.' : 'This spot is available.'}</div>
      </div>
      {!loading && (
        <div className="right">
          {!taken && (
            <div className="select-btn" onClick={() => (window.location.href = `/checkout/${props.spot}`)}>
              <Check fontSize="large" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
