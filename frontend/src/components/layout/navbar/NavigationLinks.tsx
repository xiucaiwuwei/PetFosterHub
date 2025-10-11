import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationLinksProps {
  isAuthenticated: boolean;
}

export function NavigationLinks({ isAuthenticated }: NavigationLinksProps) {
  return (
    <div className="hidden md:ml-10 md:flex md:space-x-6">
      {/* 首页 - 所有用户可见 */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          cn(
            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
            isActive
              ? "text-orange-600 font-semibold border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
          )
        }
      >
        首页
      </NavLink>

      {/* 宠物寄养 - 所有用户可见 */}
      <NavLink
        to="/fosters"
        className={({ isActive }) =>
          cn(
            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
            isActive
              ? "text-orange-600 font-semibold border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
          )
        }
      >
        宠物寄养
      </NavLink>

      {/* 宠物商店 - 所有用户可见 */}
      <NavLink
        to="/pet-store"
        className={({ isActive }) =>
          cn(
            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
            isActive
              ? "text-orange-600 font-semibold border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
          )
        }
      >
        宠物商店
      </NavLink>

      {/* 线上问诊 - 所有用户可见 */}
      <NavLink
        to="/pet-consultation"
        className={({ isActive }) =>
          cn(
            "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
            isActive
              ? "text-orange-600 font-semibold border-b-2 border-orange-500"
              : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
          )
        }
      >
        线上问诊
      </NavLink>

      {/* 消息 - 仅登录用户可见 */}
      {isAuthenticated && (
        <NavLink
            to="/messages"
            className={({ isActive }) =>
              cn(
                "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                isActive
                  ? "text-orange-600 font-semibold border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
              )
            }
          >
            消息
          </NavLink>
      )}

      {/* 订单 - 仅登录用户可见 */}
      {isAuthenticated && (
        <NavLink
            to="/profile/orders"
            className={({ isActive }) =>
              cn(
                "inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-300",
                isActive
                  ? "text-orange-600 font-semibold border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
              )
            }
          >
            我的订单
          </NavLink>
      )}
    </div>
  );
}