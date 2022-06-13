import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import ConfirmationBox from '../components/ConfirmationBox';
import LicensePlateInput from '../components/LicensePlateInput';
import { MapContainer } from '../components/MapContainer';

export default function CheckoutPage() {
  const { spot } = useParams();

  const [licensePlate, setLicensePlate] = useState<string>('');
  const [isEditingLicensePlate, setIsEditingLicensePlate] = useState<boolean>(true);

  if (!spot) {
    window.location.href = '/';
    return <></>;
  }

  function onSubmitLicensePlate(licensePlate: string) {
    setLicensePlate(licensePlate);
    setIsEditingLicensePlate(false);
  }

  return (
    <div className="wrapper">
      <div className="checkout">
        <div className="checkout-map">
          <MapContainer spot={parseInt(spot)} disableUI={true} />
        </div>
        {isEditingLicensePlate ? (
          <LicensePlateInput onSubmit={onSubmitLicensePlate} />
        ) : (
          <ConfirmationBox licensePlate={licensePlate} spot={spot} onClickEditLicensePlate={() => setIsEditingLicensePlate(true)} />
        )}
      </div>
      <div className="return">
        <div className="btn" onClick={() => (window.location.href = '/')}>
          Return to Map
        </div>
      </div>
    </div>
  );
}
