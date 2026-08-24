import { useState, type FormEvent, type ReactNode } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Video,
  Palette,
  ArrowRight,
  KeyRound,
  MessageSquare,
  ChevronDown,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Tab = 'email' | 'phone' | 'signup' | 'reset';

type Country = {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'AF', name: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
  { code: 'DZ', name: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'AG', name: 'Antigua & Barbuda', dialCode: '+1', flag: '🇦🇬' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1', flag: '🇧🇸' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', dialCode: '+1', flag: '🇧🇧' },
  { code: 'BY', name: 'Belarus', dialCode: '+375', flag: '🇧🇾' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belize', dialCode: '+501', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'BT', name: 'Bhutan', dialCode: '+975', flag: '🇧🇹' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'BA', name: 'Bosnia & Herzegovina', dialCode: '+387', flag: '🇧🇦' },
  { code: 'BW', name: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'KH', name: 'Cambodia', dialCode: '+855', flag: '🇰🇭' },
  { code: 'CM', name: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'CV', name: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'CF', name: 'Central African Republic', dialCode: '+236', flag: '🇨🇫' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'KM', name: 'Comoros', dialCode: '+269', flag: '🇰🇲' },
  { code: 'CG', name: 'Congo', dialCode: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'Congo (DRC)', dialCode: '+243', flag: '🇨🇩' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { code: 'CI', name: "Côte d'Ivoire", dialCode: '+225', flag: '🇨🇮' },
  { code: 'HR', name: 'Croatia', dialCode: '+385', flag: '🇭🇷' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { code: 'CY', name: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', dialCode: '+420', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'DJ', name: 'Djibouti', dialCode: '+253', flag: '🇩🇯' },
  { code: 'DM', name: 'Dominica', dialCode: '+1', flag: '🇩🇲' },
  { code: 'DO', name: 'Dominican Republic', dialCode: '+1', flag: '🇩🇴' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { code: 'GQ', name: 'Equatorial Guinea', dialCode: '+240', flag: '🇬🇶' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
  { code: 'SZ', name: 'Eswatini', dialCode: '+268', flag: '🇸🇿' },
  { code: 'ET', name: 'Ethiopia', dialCode: '+251', flag: '🇪🇹' },
  { code: 'FJ', name: 'Fiji', dialCode: '+679', flag: '🇫🇯' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabon', dialCode: '+241', flag: '🇬🇦' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'GD', name: 'Grenada', dialCode: '+1', flag: '🇬🇩' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
  { code: 'GW', name: 'Guinea-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
  { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', dialCode: '+354', flag: '🇮🇸' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IR', name: 'Iran', dialCode: '+98', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq', dialCode: '+964', flag: '🇮🇶' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1', flag: '🇯🇲' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮' },
  { code: 'KP', name: 'North Korea', dialCode: '+850', flag: '🇰🇵' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'KG', name: 'Kyrgyzstan', dialCode: '+996', flag: '🇰🇬' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
  { code: 'LV', name: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
  { code: 'LB', name: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
  { code: 'LS', name: 'Lesotho', dialCode: '+266', flag: '🇱🇸' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
  { code: 'LY', name: 'Libya', dialCode: '+218', flag: '🇱🇾' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮' },
  { code: 'LT', name: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { code: 'MO', name: 'Macao', dialCode: '+853', flag: '🇲🇴' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'MW', name: 'Malawi', dialCode: '+265', flag: '🇲🇼' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'MV', name: 'Maldives', dialCode: '+960', flag: '🇲🇻' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { code: 'MU', name: 'Mauritius', dialCode: '+230', flag: '🇲🇺' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲' },
  { code: 'MD', name: 'Moldova', dialCode: '+373', flag: '🇲🇩' },
  { code: 'MC', name: 'Monaco', dialCode: '+377', flag: '🇲🇨' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
  { code: 'MA', name: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
  { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'NE', name: 'Niger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'MK', name: 'North Macedonia', dialCode: '+389', flag: '🇲🇰' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'PW', name: 'Palau', dialCode: '+680', flag: '🇵🇼' },
  { code: 'PS', name: 'Palestine', dialCode: '+970', flag: '🇵🇸' },
  { code: 'PA', name: 'Panama', dialCode: '+507', flag: '🇵🇦' },
  { code: 'PG', name: 'Papua New Guinea', dialCode: '+675', flag: '🇵🇬' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'RO', name: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'RW', name: 'Rwanda', dialCode: '+250', flag: '🇷🇼' },
  { code: 'KN', name: 'Saint Kitts & Nevis', dialCode: '+1', flag: '🇰🇳' },
  { code: 'LC', name: 'Saint Lucia', dialCode: '+1', flag: '🇱🇨' },
  { code: 'VC', name: 'Saint Vincent & Grenadines', dialCode: '+1', flag: '🇻🇨' },
  { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸' },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲' },
  { code: 'ST', name: 'Sao Tome & Principe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { code: 'SL', name: 'Sierra Leone', dialCode: '+232', flag: '🇸🇱' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'SK', name: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
  { code: 'SB', name: 'Solomon Islands', dialCode: '+677', flag: '🇸🇧' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'SS', name: 'South Sudan', dialCode: '+211', flag: '🇸🇸' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'SD', name: 'Sudan', dialCode: '+249', flag: '🇸🇩' },
  { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'SY', name: 'Syria', dialCode: '+963', flag: '🇸🇾' },
  { code: 'TW', name: 'Taiwan', dialCode: '+886', flag: '🇹🇼' },
  { code: 'TJ', name: 'Tajikistan', dialCode: '+992', flag: '🇹🇯' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴' },
  { code: 'TT', name: 'Trinidad & Tobago', dialCode: '+1', flag: '🇹🇹' },
  { code: 'TN', name: 'Tunisia', dialCode: '+216', flag: '🇹🇳' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'TM', name: 'Turkmenistan', dialCode: '+993', flag: '🇹🇲' },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: '🇹🇻' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'UA', name: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistan', dialCode: '+998', flag: '🇺🇿' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺' },
  { code: 'VA', name: 'Vatican City', dialCode: '+39', flag: '🇻🇦' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabwe', dialCode: '+263', flag: '🇿🇼' },
];

export default function AuthScreen() {
  const { signIn, signUp, signInWithPhone, verifyPhoneOtp, resetPassword } = useAuth();

  const [tab, setTab] = useState<Tab>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [country, setCountry] = useState<Country>(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const fullPhone = `${country.dialCode}${phone.replace(/\s/g, '')}`;

  const resetState = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error } = await signUp({ email, password, fullName });
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess('Account created! You can now sign in with your email and password.');
      setTab('email');
    }
  };

  const handlePhone = async (e: FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error } = await signInWithPhone(fullPhone);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setOtpSent(true);
      setSuccess(`Verification code sent to ${fullPhone}.`);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error } = await verifyPhoneOtp(fullPhone, otp);
    setLoading(false);
    if (error) setError(error);
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) setError(error);
    else setSuccess('Password reset link sent to your email.');
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.dialCode.includes(countrySearch)
  );

  return (
    <div className="min-h-screen flex bg-[#0B0F14] text-white">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0B0F14] via-[#0F1320] to-[#141A23] flex-col justify-between p-12">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#3B82F6]/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#8B5CF6]/10 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Cartonix</span>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Create stunning<br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6] bg-clip-text text-transparent">
                AI cartoons & videos
              </span>
            </h1>
            <p className="mt-4 text-lg text-[#A3A7B3] max-w-md leading-relaxed">
              Turn your ideas into professional animated content with the power of AI. No editing skills required.
            </p>
          </div>

          <div className="space-y-4 max-w-sm">
            <FeatureRow icon={<Video className="w-5 h-5" />} text="Generate videos from text prompts" />
            <FeatureRow icon={<Palette className="w-5 h-5" />} text="Custom cartoon styles and characters" />
            <FeatureRow icon={<Sparkles className="w-5 h-5" />} text="AI-powered editing and effects" />
          </div>
        </div>

        <div className="relative z-10 text-sm text-[#A3A7B3]">
          Join thousands of creators making amazing content
        </div>
      </div>

      {/* Right auth panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#0B0F14]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Cartonix</span>
          </div>

          {/* Card container */}
          <div className="rounded-2xl bg-[#141A23] border border-[#232A36] p-6 sm:p-8">
            {tab !== 'reset' && tab !== 'signup' && (
              <>
                {/* Tab switcher */}
                <div className="flex gap-1 p-1 bg-[#0B0F14] rounded-xl mb-6 border border-[#232A36]">
                  <TabButton active={tab === 'email'} onClick={() => { setTab('email'); resetState(); }}>
                    <Mail className="w-4 h-4" /> Email
                  </TabButton>
                  <TabButton active={tab === 'phone'} onClick={() => { setTab('phone'); resetState(); setOtpSent(false); }}>
                    <Phone className="w-4 h-4" /> Phone
                  </TabButton>
                </div>

                {/* Email sign in */}
                {tab === 'email' && (
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Welcome back</h2>
                      <p className="text-sm text-[#A3A7B3] mt-1">Sign in to continue creating</p>
                    </div>
                    <FormField icon={<Mail className="w-4 h-4" />} label="Email">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="auth-input"
                      />
                    </FormField>
                    <FormField icon={<Lock className="w-4 h-4" />} label="Password">
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                          className="auth-input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A7B3] hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </FormField>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => { setTab('reset'); resetState(); }}
                        className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <GradientButton loading={loading}>Sign In</GradientButton>
                    <p className="text-center text-sm text-[#A3A7B3]">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setTab('signup'); resetState(); }}
                        className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
                      >
                        Sign up
                      </button>
                    </p>
                    {error && <ErrorBanner message={error} />}
                  </form>
                )}

                {/* Phone OTP */}
                {tab === 'phone' && (
                  <form onSubmit={otpSent ? handleVerifyOtp : handlePhone} className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Sign in with phone</h2>
                      <p className="text-sm text-[#A3A7B3] mt-1">
                        {otpSent ? 'Enter the code we sent you' : "We'll send you a verification code via SMS"}
                      </p>
                    </div>
                    {!otpSent ? (
                      <FormField icon={<Phone className="w-4 h-4" />} label="Phone number">
                        <div className="flex gap-2">
                          <CountrySelector
                            country={country}
                            open={countryOpen}
                            setOpen={setCountryOpen}
                            onSelect={(c) => { setCountry(c); setCountryOpen(false); setCountrySearch(''); }}
                            search={countrySearch}
                            setSearch={setCountrySearch}
                            filtered={filteredCountries}
                          />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="801 234 5678"
                            className="auth-input flex-1"
                          />
                        </div>
                      </FormField>
                    ) : (
                      <FormField icon={<MessageSquare className="w-4 h-4" />} label="Verification code">
                        <input
                          type="text"
                          required
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-digit code"
                          className="auth-input tracking-[0.3em] text-center"
                          maxLength={6}
                          inputMode="numeric"
                        />
                      </FormField>
                    )}
                    <GradientButton loading={loading}>
                      {otpSent ? 'Verify Code' : 'Send Code'}
                    </GradientButton>
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtp(''); resetState(); }}
                        className="w-full text-sm text-[#A3A7B3] hover:text-white transition-colors"
                      >
                        Use a different number
                      </button>
                    )}
                    {error && <ErrorBanner message={error} />}
                    {success && <SuccessBanner message={success} />}
                  </form>
                )}
              </>
            )}

            {/* Sign Up */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create your account</h2>
                  <p className="text-sm text-[#A3A7B3] mt-1">Start making AI cartoons for free</p>
                </div>
                <FormField icon={<User className="w-4 h-4" />} label="Full name">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="auth-input"
                  />
                </FormField>
                <FormField icon={<Mail className="w-4 h-4" />} label="Email">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                  />
                </FormField>
                <FormField icon={<Lock className="w-4 h-4" />} label="Password">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="auth-input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A7B3] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FormField>
                <GradientButton loading={loading}>
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> Create Account
                  </span>
                </GradientButton>
                <p className="text-center text-sm text-[#A3A7B3]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('email'); resetState(); }}
                    className="text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors"
                  >
                    Sign in
                  </button>
                </p>
                {error && <ErrorBanner message={error} />}
                {success && <SuccessBanner message={success} />}
              </form>
            )}

            {/* Reset Password */}
            {tab === 'reset' && (
              <form onSubmit={handleReset} className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-white">Reset password</h2>
                  <p className="text-sm text-[#A3A7B3] mt-1">We'll email you a reset link</p>
                </div>
                <FormField icon={<Mail className="w-4 h-4" />} label="Email">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="auth-input"
                  />
                </FormField>
                <GradientButton loading={loading}>
                  <span className="flex items-center justify-center gap-2">
                    <KeyRound className="w-4 h-4" /> Send Reset Link
                  </span>
                </GradientButton>
                <button
                  type="button"
                  onClick={() => { setTab('email'); resetState(); }}
                  className="w-full text-sm text-[#A3A7B3] hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to sign in
                </button>
                {error && <ErrorBanner message={error} />}
                {success && <SuccessBanner message={success} />}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[#A3A7B3]">
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-[#232A36] flex items-center justify-center text-[#8B5CF6]">
        {icon}
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-lg shadow-[#8B5CF6]/20'
          : 'text-[#A3A7B3] hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function FormField({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#A3A7B3] mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A7B3] z-10">{icon}</div>
        <div className="[&_.auth-input]:pl-10">{children}</div>
      </div>
    </div>
  );
}

function GradientButton({ children, loading }: { children: ReactNode; loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#A78BFA] hover:to-[#60A5FA] text-white font-semibold transition-all duration-200 shadow-lg shadow-[#8B5CF6]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

function CountrySelector({
  country,
  open,
  setOpen,
  onSelect,
  search,
  setSearch,
  filtered,
}: {
  country: Country;
  open: boolean;
  setOpen: (v: boolean) => void;
  onSelect: (c: Country) => void;
  search: string;
  setSearch: (v: string) => void;
  filtered: Country[];
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="auth-input flex items-center gap-2 whitespace-nowrap min-w-[110px] cursor-pointer"
      >
        <span className="text-lg leading-none">{country.flag}</span>
        <span className="text-sm font-medium">{country.dialCode}</span>
        <ChevronDown className={`w-4 h-4 text-[#A3A7B3] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-64 max-h-64 overflow-y-auto rounded-xl bg-[#141A23] border border-[#232A36] shadow-2xl z-30">
            <div className="p-2 sticky top-0 bg-[#141A23] border-b border-[#232A36]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search countries..."
                className="w-full rounded-lg bg-[#0B0F14] border border-[#232A36] px-3 py-2 text-sm text-white placeholder-[#A3A7B3] focus:outline-none focus:border-[#8B5CF6]"
                autoFocus
              />
            </div>
            <div className="py-1">
              {filtered.length === 0 && (
                <div className="px-3 py-2 text-sm text-[#A3A7B3]">No countries found</div>
              )}
              {filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => onSelect(c)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                    c.code === country.code
                      ? 'bg-[#8B5CF6]/20 text-white'
                      : 'text-[#A3A7B3] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-lg leading-none">{c.flag}</span>
                  <span className="flex-1 text-left">{c.name}</span>
                  <span className="text-xs font-mono">{c.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
      {message}
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-300">
      {message}
    </div>
  );
}
