import { useEffect, useState } from 'react';

export default function LicensePlateInput(props: { onSubmit: Function }) {
  const [licensePlate, setLicensePlate] = useState<string>('');

  useEffect(() => {
    setLicensePlate(licensePlate.toLocaleUpperCase());
  }, [licensePlate]);

  return (
    <div className="box">
      <div>
        <div className="title">License Plate #</div>
        <div>Please enter your license plate number.</div>
        <input type="text" className="mono" placeholder="ABC123" onChange={(e) => setLicensePlate(e.target.value)} value={licensePlate} />
      </div>
      <div className="btn" onClick={(e) => props.onSubmit(licensePlate)}>
        Submit
      </div>
    </div>
  );
}
