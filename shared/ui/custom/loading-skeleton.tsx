import { Skeleton } from "../skeleton";
import { Wrapper } from "./wrapper";

type Props = {
  height?: number;
  count?: number;
};

export const LoadingSkeleton: React.FC<Props> = ({ height = 146, count = 4 }) => {
  return (
    <Wrapper>
      <ul className="flex flex-col gap-4">
        {Array.from({ length: count }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton items have no identity.
          <li key={index}>
            <Skeleton style={{ height }} className="bg-background" />
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};
