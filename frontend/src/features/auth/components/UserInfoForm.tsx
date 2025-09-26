import React from 'react';

interface UserInfoFormProps {
    name: string;
    setName: (name: string) => void;
    password: string;
    setPassword: (password: string) => void;
    confirmPassword: string;
    setConfirmPassword: (password: string) => void;
    errors: {
        name?: string | undefined;
        password?: string | undefined;
        confirmPassword?: string | undefined;
    };
    setErrors: (newErrors: { name?: string | undefined; password?: string | undefined; confirmPassword?: string | undefined; }) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
                                                       name,
                                                       setName,
                                                       password,
                                                       setPassword,
                                                       confirmPassword,
                                                       setConfirmPassword,
                                                       errors,
                                                       setErrors
                                                   }) => {
    return (
        <>
            <div
                className="relative group mb-6"
            >
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    昵称
                </label>
                <div className="relative">
                    <div
                        className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                        <i className={`fa-solid fa-user ${errors.name ? 'text-red-500' : 'text-orange-400'}`}></i>
                    </div>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => {setName(e.target.value); if (errors.name) setErrors({...errors, name: undefined});}}
                        className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}
              rounded-xl focus:outline-none transition-all duration-300
              placeholder-gray-400 group-hover:border-orange-200 ${errors.name ? 'group-hover:border-red-400' : ''}`}
                        placeholder="请输入昵称"
                    />
                    <div
                        className="absolute -bottom-1 left-12 right-4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
                {errors.name && (
                    <p
                        className="mt-1 text-sm text-red-600"
                    >
                        <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                        {errors.name}
                    </p>
                )}
            </div>

            <div
                className="relative group mb-6"
            >
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    密码
                </label>
                <div className="relative">
                    <div
                        className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                        <i className={`fa-solid fa-lock ${errors.password ? 'text-red-500' : 'text-orange-400'}`}></i>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); if (errors.password) setErrors({...errors, password: undefined});}}
                        className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}
              rounded-xl focus:outline-none transition-all duration-300
              placeholder-gray-400 group-hover:border-orange-200 ${errors.password ? 'group-hover:border-red-400' : ''}`}
                        placeholder="请设置密码"
                    />
                    <div
                        className="absolute -bottom-1 left-12 right-4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
                {errors.password && (
                    <p
                        className="mt-1 text-sm text-red-600"
                    >
                        <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                        {errors.password}
                    </p>
                )}
            </div>

            <div
                className="relative group"
            >
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                    确认密码
                </label>
                <div className="relative">
                    <div
                        className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300">
                        <i className={`fa-solid fa-lock ${errors.confirmPassword ? 'text-red-500' : 'text-orange-400'}`}></i>
                    </div>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});}}
                        className={`block w-full pl-12 pr-4 py-3 border-2 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}
              rounded-xl focus:outline-none transition-all duration-300
              placeholder-gray-400 group-hover:border-orange-200 ${errors.confirmPassword ? 'group-hover:border-red-400' : ''}`}
                        placeholder="请再次输入密码"
                    />
                    <div
                        className="absolute -bottom-1 left-12 right-4 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
                {errors.confirmPassword && (
                    <p
                        className="mt-1 text-sm text-red-600"
                    >
                        <i className="fa-solid fa-circle-exclamation mr-1 animate-pulse"></i>
                        {errors.confirmPassword}
                    </p>
                )}
            </div>
        </>
    );
};

export default UserInfoForm;