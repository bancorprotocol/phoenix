import { NavLink } from 'react-router-dom';
import { Tooltip } from 'components/tooltip/Tooltip';
import { ReactComponent as IconPlus } from 'assets/icons/plus-circle.svg';
import { ReactComponent as IconSync } from 'assets/icons/sync.svg';
import { Pool } from 'services/observables/tokens';

export const PoolsTableCellActions = (pool: Pool) => {
  const href = pool.isProtected
    ? `/addProtection/${pool.pool_dlt_id}`
    : `/addLiquidity/${pool.pool_dlt_id}`

  return (
    <div className="flex">
      <NavLink
        to={href}
        className="btn-outline-primary btn-sm rounded-[12px] !w-[35px] !h-[35px] p-0 border shadow-header"
      >
      <Tooltip
          content="Stake & Earn"
          button={
            <IconPlus
              className={`w-20 hover:rotate-180 transition-transform duration-300`}
            />
          }
        />
        </NavLink>
      <NavLink
        to="/"
        className="btn-outline-primary btn-sm rounded-[12px] !w-[35px] !h-[35px] p-0 border shadow-header"
      >
        <Tooltip
          content="Trade"
          button={
            <IconSync
              className={`w-20 hover:rotate-180 transition-transform duration-300`}
            />
          }
        />
      </NavLink>
    </div>
  );
};
