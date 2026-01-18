import Container from "./Container/Container";
import InputBox from "./Container/InputBox";

import HomePage from './Home/Home';
import AboutUs from './Home/Aboutus';
import Footer from './Home/Footer';

import Services from './Home/Services';

import Button from "./Button";
import NavBar from "./NavBar/NavBar";

import LoginSingupBtn from "./Login/Login&SignupBtn";
import LoginComponent from "./Login/Login";
import SignupComponent from "./SignUp/signup";
import OtpInput from "./OtpVerification/OtpInput";
import EmailOtpVerification from "./OtpVerification/EmailOtpVerification";
import Protected from "./protectedRoute/ProtectedRoute";
import SuperAdminVerification from "./SignUp/SuperAdminVerification";
import DashboardLayout from "./Dashboard/Layout/DashboardLayout";
import MainContentLayout from "./Dashboard/Layout/MainContentLayout";
import SideBarLayout from "./Dashboard/Layout/SideBarLayout";
import LogoutButton from "./Dashboard/Layout/LogoutButton";
import NavbarLink from "./Dashboard/SideBarComponent/NavLink";
import OrganizationCard from "./Dashboard/SideBarComponent/OrganizationCard";
import UserCard from "./Dashboard/SideBarComponent/UserCard";
import InfoContainer from "./Dashboard/DashboardPageComponent/InfoContainer";
import Title from "./Title/Title";
import SearchBar from "./SearchBox/SearchBar";
import FilterComponent from "./FilterComponents/FilterComponent";
import SegmentedProgressBar from "./Chart/SegmentedProgressBar";
import TableBody from "./DataTable/TableBody/TableBody";
import TableHead from "./DataTable/TableHead/TableHead";
import DataTable from "./DataTable/DataTable";
import StockFilterBar from "./Stock/FilterBar";
import StockGeneralInfoBar from "./Stock/StockGeneralInfoBar";
import StockInformationTable from "./Stock/StockInformationTable";
import StockLayout from "./Stock/StockLayout";
import Stock from "../pages/Stock/Stock";
import StockTitle from "./Stock/StockTitle";
import StaffCountBar from "./Staff/StaffCountBar";
import StaffFilterBar from "./Staff/StaffFilterBar";
import StaffInfoTable from "./Staff/StaffInfoTable";
import StaffTitle from "./Staff/StaffTitle";
import StaffLayout from "./Staff/StaffLayout";
import Staff from "../pages/Staff/Staff";
import NewButton from "./Button/Button";
import IconImage from "./Icons/ImageIcon";
import { DotsVerticalIcon } from "./Icons/DotsVerficalIcon";
import { DotsHortlIcon } from "./Icons/DotsHortlIcon";
import ActionComponents from "./Actions/ActionComponet";
import Update from "./Actions/Update";
import Delete from "./Actions/Delete";



export {
    Container, 
    InputBox,
    HomePage, AboutUs,
    Footer,
    Services,
    
    Button,
    NavBar,
    LoginSingupBtn,
    LoginComponent,
    SignupComponent,
    OtpInput,
    EmailOtpVerification,
    Protected,
    SuperAdminVerification,


    DashboardLayout,
    MainContentLayout,
    SideBarLayout,

    OrganizationCard, 
    UserCard, 
    LogoutButton,
    NavbarLink,

    InfoContainer, 

   
    SearchBar,
    FilterComponent ,
    SegmentedProgressBar,

    //Table Main Componets
    DataTable,
    TableHead,
    TableBody,

    //Componet for adding title for pages
    Title,

    //stock page components 
    StockLayout,
    StockFilterBar,
    StockInformationTable,
    StockGeneralInfoBar,
    StockTitle,

    //Staff Page componets 
    StaffCountBar,
    StaffFilterBar,
    StaffTitle,
    StaffLayout,
    StaffInfoTable,
    

    //pages
    Stock,
    Staff,


    NewButton,
    IconImage, 
    DotsVerticalIcon,
    DotsHortlIcon,

    //Action button
    Update, Delete, ActionComponents,



 
};