import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, History, Settings, LogOut, Home, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/panel' },
    { icon: Package, label: 'Inventory', path: '/inventory' }, // (Jeszcze nie masz tej strony, ale się przyda)
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#171a21] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-40 hidden md:flex">
      {/* Logo Area */}
      <div className="p-6 flex items-center gap-3 border-b border-white/5 h-20">
        <div className="w-8 h-8 rounded bg-white from-steam-accent to-blue-600 flex items-center justify-center shadow-lg">
          <svg width="1039" height="1039" viewBox="0 0 1039 1039" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_709_11)">
          <path d="M811.719 0H227.281C101.757 0 0 101.757 0 227.281V811.719C0 937.243 101.757 1039 227.281 1039H811.719C937.243 1039 1039 937.243 1039 811.719V227.281C1039 101.757 937.243 0 811.719 0Z" fill="url(#paint0_radial_709_11)"/>
          <path d="M811.719 0H227.281C101.757 0 0 101.757 0 227.281V811.719C0 937.243 101.757 1039 227.281 1039H811.719C937.243 1039 1039 937.243 1039 811.719V227.281C1039 101.757 937.243 0 811.719 0Z" fill="url(#paint1_radial_709_11)"/>
          <path d="M464.369 276.175C431.44 248.843 393.931 235.834 351.774 234.449C316.198 233.28 282.146 238.228 249.961 254.151C203.959 276.911 174.612 313.509 165.083 363.434C154.016 421.417 173.412 474.319 228.453 508.022C259.792 527.212 294.776 536.443 329.458 546.791C356.987 555.006 384.452 563.32 409.189 578.888C463.793 613.253 463.131 704.462 399.755 736.522C348.523 762.439 297.313 759.486 247.942 730.288C234.782 722.506 224.421 711.151 215.889 698.56C204.564 681.847 195.919 663.723 191.028 644.013C188.624 634.327 193.68 625.362 202.578 622.851C211.847 620.236 220.476 624.667 223.869 634.247C229.252 649.446 234.512 664.608 244.006 677.972C261.738 702.932 286.16 715.247 316.232 717.961C337.12 719.846 357.195 717.528 376.601 709.322C411.624 694.511 424.473 651.598 403.14 620.276C398.687 613.737 392.444 609.358 385.779 605.413C368.552 595.219 349.701 589.058 330.708 583.296C298.955 573.663 266.579 565.911 236.324 551.792C204.096 536.752 175.703 516.822 155.826 486.672C127.641 443.916 119.972 397.116 133.076 347.978C155.354 264.44 212.988 219.143 295.651 202.763C337.887 194.393 379.711 197.257 420.298 211.454C462.992 226.388 497.246 252.939 523.036 290.264C537.117 310.642 546.749 333.137 555.186 356.257C556.711 360.436 555.248 362.188 551.518 363.374C543.96 365.776 536.393 368.167 528.941 370.868C525.033 372.285 523.48 370.386 522.231 367.288C519.728 361.08 517.128 354.91 514.654 348.69C503.562 320.802 487.133 296.614 464.369 276.175Z" fill="url(#paint2_radial_709_11)"/>
          <path d="M280.351 424.492C295.534 436.798 313.092 442.91 330.865 448.505C356.848 456.685 383.277 463.376 409.004 472.446C447.906 486.162 483.324 505.234 511.224 536.456C527.367 554.52 537.029 576.307 546.706 598.054C582.478 678.439 618.13 758.878 653.817 839.301C654.713 841.32 655.961 843.255 655.655 845.631C642.565 853.657 620.32 846.089 612.645 830.831C598.271 802.254 586.186 772.632 573.122 743.459C550.84 693.699 529.042 643.723 506.842 593.926C492.651 562.095 469.057 539.298 438.479 523.042C406.238 505.901 371.45 496.088 336.599 486.331C318.204 481.181 300.126 475.185 282.783 467.058C251.387 452.346 231.092 429.583 230.39 393.365C229.668 356.082 245.401 326.724 278.492 309.822C326.889 285.101 374.723 287.693 419.106 320.661C440.91 336.857 451.625 360.749 460.276 385.635C461.252 388.44 460.903 390.554 457.792 391.472C449.239 393.994 440.672 396.465 432.107 398.947C428.336 400.039 427.437 397.338 426.465 394.682C423.311 386.064 419.987 377.533 415.38 369.541C400.966 344.543 379.223 331.854 350.592 329.779C330.571 328.329 311.676 330.993 293.918 340.893C271.475 353.405 259.815 381.566 267.518 405.977C269.807 413.231 274.104 419.258 280.351 424.492Z" fill="url(#paint3_radial_709_11)"/>
          <path d="M216.802 782.708C252.401 804.669 290.961 815.14 331.899 814.186C386.279 812.92 434.308 794.498 472.607 754.678C493.611 732.84 505.878 706.254 511.505 676.55C512.087 673.477 512.912 670.449 514.039 665.626C520.009 674.334 522.411 682.956 526.626 690.6C527.581 692.331 528.04 694.372 529.154 695.973C539.571 710.934 534.772 724.56 526.6 738.71C491.326 799.786 438.003 834.344 369.219 845.385C309.37 854.992 252.368 845.625 200.475 813.5C146.729 780.228 112.255 732.506 98.6411 670.328C96.115 658.791 101.19 649.725 111.464 647.211C120.653 644.962 128.746 650.61 131.97 661.943C137.539 681.516 143.368 700.978 154.055 718.53C169.92 744.587 190.797 765.787 216.802 782.708Z" fill="url(#paint4_radial_709_11)"/>
          <path d="M482.782 445.47C489.985 462.607 496.992 479.207 503.998 495.806C500.977 497.925 499.622 495.328 498.092 494.126C487.136 485.522 475.622 477.725 463.106 471.648C456.137 468.264 451.552 463.416 449.245 456.173C447.161 449.632 443.589 443.565 442.467 435.863C452.958 432.357 463.181 428.94 473.98 425.331C477.058 432.341 479.822 438.638 482.782 445.47Z" fill="url(#paint5_radial_709_11)"/>
          <path d="M730.636 728.384C713.339 764.214 698.757 800.787 678.772 835.283C672.869 831.559 672.848 826.264 670.329 822.538C659.321 806.252 661.843 791.432 670.267 773.814C712.501 685.483 753.142 596.391 794.391 507.588C810.262 473.419 826.317 439.336 842.128 405.14C844.146 400.776 846.395 399.755 850.758 401.844C863.5 407.947 876.361 413.8 889.182 419.739C891.832 420.966 894.411 422.483 899.299 422.35C890.936 364.533 882.872 307.214 873.11 248.407C825.113 280.332 778.066 311.625 730.101 343.528C744.889 350.478 758.59 357.191 772.518 363.392C788.449 370.485 788.466 370.255 781.28 385.88C760.773 430.467 740.414 475.123 719.832 519.675C702.684 556.798 685.305 593.814 668.023 630.874C664.453 638.531 659.332 644.266 650.135 644.313C640.914 644.361 635.714 638.814 632.36 630.935C612.26 583.729 592.142 536.53 572.066 489.313C562.077 465.82 552.154 442.299 542.229 418.778C540.707 415.172 539.335 411.502 537.638 407.213C547.682 402.69 557.806 400.469 567.646 397.503C571.26 396.414 572.051 399.994 573.067 402.391C583.613 427.256 594.028 452.176 604.604 477.028C619.256 511.46 634.012 545.847 648.743 580.244C649.111 581.106 649.707 581.87 651.116 584.197C681.696 518.287 711.761 453.486 742.284 387.697C714.758 375.208 687.596 362.883 658.474 349.67C739.265 295.829 818.617 242.946 899.564 189C914.123 287.815 928.399 384.71 943 483.814C915.019 470.589 888.962 458.274 861.974 445.518C818.227 539.759 774.561 633.824 730.636 728.384Z" fill="url(#paint6_radial_709_11)"/>
          </g>
          <defs>
          <radialGradient id="paint0_radial_709_11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41560 36365) scale(72730)">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="#F7F7F7"/>
          </radialGradient>
          <radialGradient id="paint1_radial_709_11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(41560 36365) scale(72730)">
          <stop stop-color="white"/>
          <stop offset="1" stop-color="#F7F7F7"/>
          </radialGradient>
          <radialGradient id="paint2_radial_709_11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12994.3 16881.9) scale(30024 38928.8)">
          <stop stop-color="#FF7A7E"/>
          <stop offset="1" stop-color="#E04E53"/>
          </radialGradient>
          <radialGradient id="paint3_radial_709_11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12990.4 16960.3) scale(29773.5 38889.5)">
          <stop stop-color="#FF7A7E"/>
          <stop offset="1" stop-color="#E04E53"/>
          </radialGradient>
          <radialGradient id="paint4_radial_709_11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(13211.3 6714.23) scale(30597.7 14157.5)">
          <stop stop-color="#FF7A7E"/>
          <stop offset="1" stop-color="#E04E53"/>
          </radialGradient>
          <radialGradient id="paint5_radial_709_11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(2288.41 2563.74) scale(4307.19 4989.63)">
          <stop stop-color="#FF7A7E"/>
          <stop offset="1" stop-color="#E04E53"/>
          </radialGradient>
          <radialGradient id="paint6_radial_709_11" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12698.5 19577.5) scale(28375.4 45239.8)">
          <stop stop-color="#E04E53"/>
          <stop offset="1" stop-color="#C0383D"/>
          </radialGradient>
          <clipPath id="clip0_709_11">
          <rect width="1039" height="1039" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        </div>
        <span className="text-xl font-bold text-white tracking-tight uppercase">
          Skin<span className="text-steam-accent">vestments</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive 
                ? 'bg-steam-accent/10 text-steam-accent font-bold shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'}
            `}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5 bg-[#14161b]">
        
        {/* Link powrotu na stronę główną */}
        <NavLink to="/" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors text-sm font-medium mb-1">
            <Home className="w-4 h-4" /> Back to Home
        </NavLink>

        <button 
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};