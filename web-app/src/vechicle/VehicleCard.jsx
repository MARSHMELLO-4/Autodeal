import React from "react";

const VehicleCard = ({vehicle, onOpen}) => {
  return (
    <article className="vehicle-card" key={vehicle.id}>
      <button
        className="image-button"
        type="button"
        onClick={() => openVehicle(vehicle.id)}
      >
        {vehicle.thumbnailUrl ? (
          <img src={vehicle.thumbnailUrl} alt={vehicle.title} />
        ) : (
          <span className="image-placeholder">
            <Bike size={48} />
          </span>
        )}
        <span className={`status status-${vehicle.status.toLowerCase()}`}>
          {vehicle.status}
        </span>
      </button>
      <div className="vehicle-card-body">
        <div>
          <h2>{vehicle.title}</h2>
          <p>
            {vehicle.brand} {vehicle.modelName} - {vehicle.manufactureYear}
          </p>
        </div>
        <strong className="price">{formatPrice(vehicle.price)}</strong>
        <div className="spec-row">
          <span>
            <Gauge size={15} />
            {formatKm(vehicle.kilometersDriven)}
          </span>
          <span>
            <Bike size={15} />
            {vehicle.fuelType}
          </span>
        </div>
        <button
          type="button"
          className="details-button"
          onClick={() => openVehicle(vehicle.id)}
        >
          View details
        </button>
      </div>
    </article>
  );
};

export default VehicleCard;
