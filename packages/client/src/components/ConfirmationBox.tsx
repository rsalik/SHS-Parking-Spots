import { getUser } from '../auth/googleAuth';

export default function ConfirmationBox(props: { spot: string; licensePlate: string; onClickEditLicensePlate: Function }) {
  return (
    <div className="box">
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
            <span className="key">License Plate</span>:{' '}
            <span className="u" style={{ cursor: 'pointer' }} onClick={() => props.onClickEditLicensePlate()}>
              {props.licensePlate}
            </span>
          </div>
          <div className="row">
            <span className="key">Spot</span>: #{props.spot}
          </div>
        </div>

        <div className="warning">Incorrect information can lead to delays or different spot assignment.</div>
        <br />
        <div className="warning u">You will not be able to request a different spot after submitting!</div>
      </div>

      <div className="btn">Submit</div>
    </div>
  );
}
