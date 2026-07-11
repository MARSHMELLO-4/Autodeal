import React from "react";

const VehicleDrawer = ({vehicle, detailLoading, }) => {
  return (
    <div
      className="drawer-backdrop"
      role="presentation"
      onClick={() => setSelectedVehicle(null)}
    >
      <aside
        className="detail-drawer"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="icon-button"
          type="button"
          onClick={() => setSelectedVehicle(null)}
          aria-label="Close details"
        >
          <X size={20} />
        </button>
        {detailLoading && (
          <div className="drawer-loading">Loading bike details...</div>
        )}
        {selectedVehicle && !detailLoading && (
          <VehicleDetails vehicle={selectedVehicle} />
        )}
      </aside>
    </div>
  );
};

export default VehicleDrawer;
