export const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

 export  const getNameFromUid = (uid) => {
    const name = 'TODO'; // TODO: Implement this
    return name;
  }


  export const emailShortner = (email) => {
    return email.split("@")[0];
  }