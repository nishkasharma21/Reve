// @ts-nocheck
import React from "react";
import { useParams } from "react-router";
import { useStripeAccount as useAccount } from "../../contexts/StripeAccountContext";

const Storefront = () => {
  const { accountId } = useParams();

  return (
    <div className="App">
      <div className="container">
        <div className="logo">
          {accountId === "platform"
            ? "Platform Products"
            : `Store ${accountId}`}
        </div>
      </div>
    </div>
  );
};

export default Storefront;