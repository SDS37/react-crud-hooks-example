type IceCreamImageProps = {
  iceCreamId?: number;
};

const IceCreamImage = ({ iceCreamId }: IceCreamImageProps) =>
  iceCreamId != null && (
    <img
      src={`${import.meta.env.BASE_URL}ice-cream-images/ice-cream-${iceCreamId}.svg`}
      alt=""
    />
  );

export default IceCreamImage;
