import { useParams } from 'react-router';
import { getUser } from '../auth/googleAuth';
import { MapContainer } from '../components/MapContainer';

export default function CheckoutPage() {
  const { spot } = useParams();

  if (!spot) {
    window.location.href = '/';
    return <></>;
  }

  return (
    <div className="wrapper">
      <div className="checkout">
        <div className="checkout-map">
          <MapContainer spot={parseInt(spot)} disableUI={true} />
        </div>
        <div className="confirm">
          <div>
            <div className="title">Confirmation</div>
            <div className="warning">Confirm that the following information is correct.</div>

            <div className="info">
              <div className="row">
                <span className="key">Name</span>: {getUser().name}
              </div>
              <div className="row">
                <span className="key">Email</span>: {getUser().email}
              </div>
              <div className="row">
                <span className="key">Spot</span>: #{spot}
              </div>
            </div>

            <div className="warning">Incorrect information can lead to delays or different spot assignment.</div>
            <br />
            <div className="warning u">You will not be able to request a different spot after submitting!</div>
          </div>

          <div className="btn">Submit</div>
        </div>
      </div>
      <div className="return">
        <div className="btn" onClick={() => (window.location.href = '/')}>
          Return to Map
        </div>
      </div>
    </div>
  );
}
