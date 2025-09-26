import React from 'react';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showQuickJumps?: boolean;
  showInfo?: boolean;
}

/**
 * 分页组件
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  showQuickJumps = true,
  showInfo = true
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = Math.max(1, (currentPage - 1) * itemsPerPage + 1);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleQuickJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      e.target.value = currentPage.toString();
    }
  };

  // 生成分页数字按钮
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // 调整起始页，确保显示足够的页码
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    // 显示第一页按钮
    if (startPage > 1) {
      pageNumbers.push(
        <button
          key="first"
          className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className="px-2 text-gray-500">...</span>
        );
      }
    }

    // 显示中间页码按钮
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-3 py-1 rounded-md focus:outline-none ${currentPage === i ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // 显示最后一页按钮
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className="px-2 text-gray-500">...</span>
        );
      }
      pageNumbers.push(
        <button
          key="last"
          className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-6">
      {showInfo && (
        <div className="text-sm text-gray-600 mb-4 md:mb-0">
          显示第 {startItem} - {endItem} 条，共 {totalItems} 条记录
        </div>
      )}
      <div className="flex items-center space-x-2">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fa-solid fa-chevron-left mr-1"></i> 上一页
        </button>

        {renderPageNumbers()}

        <button
          className={`px-3 py-1 rounded-md text-sm font-medium focus:outline-none ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一页 <i className="fa-solid fa-chevron-right ml-1"></i>
        </button>

        {showQuickJumps && totalPages > 1 && (
          <div className="flex items-center ml-4">
            <span className="text-sm text-gray-600 mr-2">前往</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={handleQuickJump}
              className="w-12 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-600 ml-2">页</span>
          </div>
        )}
      </div>
    </div>
  );
};