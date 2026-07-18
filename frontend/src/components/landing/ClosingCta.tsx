import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Button } from '../ui/Button';
import { BrandMark } from './icons';

export function ClosingCta() {
  return (
    <section className="py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 px-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Ready when you are</p>
          <h2 className="mt-3 text-4xl font-semibold text-foreground sm:text-5xl">
            See your business
            <br />
            in numbers.
          </h2>
          <Link to={ROUTES.register} className="mt-8 inline-block">
            <Button className="cursor-pointer px-6 py-3 text-base">Create your free account</Button>
          </Link>
        </div>

        <BrandMark width={72} height={72} className="text-primary opacity-80" />
      </div>
    </section>
  );
}
