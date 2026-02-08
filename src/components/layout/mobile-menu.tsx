// export default function MobileMenu() {
//     return (
//         <div className="sm:hidden bg-white border-b shadow-lg">
//             <div className="px-4 py-3 space-y-2">
//                 <button
//                     onClick={() => {
//                         setUserRole('coach');
//                         setMobileMenuOpen(false);
//                     }}
//                     className={`w-full px-4 py-2 rounded-lg font-medium text-left ${
//                         userRole === 'coach' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
//                     }`}
//                 >
//                     Coach View
//                 </button>
//                 <button
//                     onClick={() => {
//                         setUserRole('member');
//                         setMobileMenuOpen(false);
//                     }}
//                     className={`w-full px-4 py-2 rounded-lg font-medium text-left ${
//                         userRole === 'member' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
//                     }`}
//                 >
//                     Member View
//                 </button>
//             </div>
//         </div>
//     );
// }
