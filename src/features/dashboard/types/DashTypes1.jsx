import {cardTitleStyle} from "../../../layouts/AuthLayout";
import {dashPs3Style} from "../dashboard";
import {DotLoader} from "react-spinners";

export const DashTypes1 = ({ menu, title, icon, num, percent, label, color, loadColor='', isFetching = false }) => {
  return (
    <>
      <h5 className='card-title' style={cardTitleStyle}>{title} <span>| {menu}</span></h5>
      <div className='d-flex align-items-center'>
        <div className='card-icon rounded-circle d-flex align-items-center justify-content-center'>
          {icon && icon}
        </div>
        <div className='ps-3'>
          <h6 style={dashPs3Style}>
            {!isFetching && num}
            {isFetching && <DotLoader loading={isFetching} color={loadColor} size={30} />}
          </h6>

          <span className={`text-${color} small pt-1 fw-bold`}>
            {!isFetching && `${percent > 100 ? '+100' : percent}%`}
          </span>

          <span className="text-muted small pt-2 ps-1">
            {!isFetching && `${label}`}
          </span>
        </div>
      </div>
    </>
  )
}
