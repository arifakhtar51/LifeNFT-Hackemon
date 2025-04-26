lifenft/
│
├── .github/                  # GitHub configurations
│   ├── workflows/            # GitHub Actions workflows
│   │   └── deploy.yml        # Automatic deployment workflow
│   └── ISSUE_TEMPLATE/       # Issue templates
│
├── public/                   # Public static files
│   ├── favicon.ico           # Site favicon
│   ├── robots.txt            # Search engine instructions
│   ├── index.html            # HTML entry point
│   ├── manifest.json         # PWA manifest
│   └── assets/               # Static assets
│       ├── images/           # Image files
│       │   ├── logo.png      # App logo
│       │   ├── hero.jpg      # Hero image
│       │   └── blood-types/  # Blood type images
│       │       ├── a-pos.png # A+ blood type image
│       │       ├── a-neg.png # A- blood type image
│       │       ├── b-pos.png # B+ blood type image
│       │       └── ...       # Other blood type images
│       └── nft-templates/    # NFT template images
│           ├── template-a-pos.png # A+ NFT template
│           ├── template-a-neg.png # A- NFT template
│           └── ...           # Other NFT templates
│
├── src/                      # Source code
│   ├── assets/               # Project assets
│   │   ├── images/           # Image files
│   │   │   ├── icons/        # Icon SVG files
│   │   │   │   ├── donation.svg  # Donation icon
│   │   │   │   ├── hospital.svg  # Hospital icon
│   │   │   │   ├── user.svg      # User icon
│   │   │   │   ├── nft.svg       # NFT icon
│   │   │   │   ├── verify.svg    # Verification icon
│   │   │   │   └── ...           # Other icons
│   │   │   └── illustrations/    # Illustration files
│   │   │       ├── empty-state.svg  # Empty state illustration
│   │   │       ├── success.svg      # Success illustration
│   │   │       └── error.svg        # Error illustration
│   │   │
│   │   ├── animations/       # Lottie animation files
│   │   │   ├── loading.json  # Loading animation
│   │   │   │   ├── success.json  # Success animation
│   │   │   │   └── error.json    # Error animation
│   │   │
│   │   └── styles/           # Global styles
│   │       ├── index.css     # Main CSS entry
│   │       ├── variables.css # CSS variables
│   │       ├── reset.css     # CSS reset
│   │       ├── typography.css # Typography styles
│   │       ├── animations.css # CSS animations
│   │       └── utils.css     # Utility classes
│   │
│   ├── components/           # Reusable components
│   │   ├── common/           # Generic UI components
│   │   │   ├── Button/       # Button component
│   │   │   │   ├── Button.js # Button implementation
│   │   │   │   ├── Button.test.js # Button tests
│   │   │   │   └── index.js  # Button export
│   │   │   │
│   │   │   ├── Card/         # Card component
│   │   │   │   ├── Card.js   # Card implementation
│   │   │   │   ├── Card.test.js # Card tests
│   │   │   │   └── index.js  # Card export
│   │   │   │
│   │   │   ├── Input/        # Input component
│   │   │   │   ├── Input.js  # Input implementation
│   │   │   │   ├── TextArea.js # TextArea implementation
│   │   │   │   ├── Select.js # Select implementation
│   │   │   │   ├── Input.test.js # Input tests
│   │   │   │   └── index.js  # Input export
│   │   │   │
│   │   │   ├── Modal/        # Modal component
│   │   │   │   ├── Modal.js  # Modal implementation
│   │   │   │   ├── ModalHeader.js # Modal header
│   │   │   │   ├── ModalBody.js # Modal body
│   │   │   │   ├── ModalFooter.js # Modal footer
│   │   │   │   ├── Modal.test.js # Modal tests
│   │   │   │   └── index.js  # Modal export
│   │   │   │
│   │   │   ├── Spinner/      # Spinner component
│   │   │   │   ├── Spinner.js # Spinner implementation
│   │   │   │   ├── Spinner.test.js # Spinner tests
│   │   │   │   └── index.js  # Spinner export
│   │   │   │
│   │   │   ├── Toast/        # Toast notification
│   │   │   │   ├── Toast.js  # Toast implementation
│   │   │   │   ├── ToastManager.js # Toast manager
│   │   │   │   ├── Toast.test.js # Toast tests
│   │   │   │   └── index.js  # Toast export
│   │   │   │
│   │   │   ├── Pagination/   # Pagination component
│   │   │   │   ├── Pagination.js # Pagination implementation
│   │   │   │   ├── Pagination.test.js # Pagination tests
│   │   │   │   └── index.js  # Pagination export
│   │   │   │
│   │   │   ├── Dropdown/     # Dropdown component
│   │   │   │   ├── Dropdown.js # Dropdown implementation
│   │   │   │   ├── Dropdown.test.js # Dropdown tests
│   │   │   │   └── index.js  # Dropdown export
│   │   │   │
│   │   │   ├── Badge/        # Badge component
│   │   │   │   ├── Badge.js  # Badge implementation
│   │   │   │   ├── Badge.test.js # Badge tests
│   │   │   │   └── index.js  # Badge export
│   │   │   │
│   │   │   ├── Avatar/       # Avatar component
│   │   │   │   ├── Avatar.js # Avatar implementation
│   │   │   │   ├── Avatar.test.js # Avatar tests
│   │   │   │   └── index.js  # Avatar export
│   │   │   │
│   │   │   ├── Tabs/         # Tabs component
│   │   │   │   ├── Tabs.js   # Tabs implementation
│   │   │   │   ├── Tab.js    # Tab implementation
│   │   │   │   ├── TabPanel.js # Tab panel implementation
│   │   │   │   ├── Tabs.test.js # Tabs tests
│   │   │   │   └── index.js  # Tabs export
│   │   │   │
│   │   │   ├── Alert/        # Alert component
│   │   │   │   ├── Alert.js  # Alert implementation
│   │   │   │   ├── Alert.test.js # Alert tests
│   │   │   │   └── index.js  # Alert export
│   │   │   │
│   │   │   ├── FormGroup/    # Form group component
│   │   │   │   ├── FormGroup.js # FormGroup implementation
│   │   │   │   ├── FormLabel.js # Form label
│   │   │   │   ├── FormError.js # Form error
│   │   │   │   ├── FormGroup.test.js # FormGroup tests
│   │   │   │   └── index.js  # FormGroup export
│   │   │   │
│   │   │   ├── ErrorBoundary/ # Error boundary
│   │   │   │   ├── ErrorBoundary.js # ErrorBoundary implementation
│   │   │   │   ├── ErrorBoundary.test.js # ErrorBoundary tests
│   │   │   │   └── index.js  # ErrorBoundary export
│   │   │   │
│   │   │   ├── EmptyState/   # Empty state component
│   │   │   │   ├── EmptyState.js # EmptyState implementation
│   │   │   │   ├── EmptyState.test.js # EmptyState tests
│   │   │   │   └── index.js  # EmptyState export
│   │   │   │
│   │   │   └── index.js      # Export all common components
│   │   │
│   │   ├── layout/           # Layout components
│   │   │   ├── Header/       # Header component
│   │   │   │   ├── Header.js # Header implementation
│   │   │   │   ├── HeaderUserMenu.js # User menu in header
│   │   │   │   ├── HeaderNotifications.js # Notifications in header
│   │   │   │   ├── HeaderLogo.js # Logo in header
│   │   │   │   ├── Header.test.js # Header tests
│   │   │   │   └── index.js  # Header export
│   │   │   │
│   │   │   ├── Sidebar/      # Sidebar component
│   │   │   │   ├── Sidebar.js # Sidebar implementation
│   │   │   │   ├── SidebarNav.js # Sidebar navigation
│   │   │   │   ├── SidebarFooter.js # Sidebar footer
│   │   │   │   ├── SidebarToggle.js # Sidebar toggle button
│   │   │   │   ├── Sidebar.test.js # Sidebar tests
│   │   │   │   └── index.js  # Sidebar export
│   │   │   │
│   │   │   ├── Footer/       # Footer component
│   │   │   │   ├── Footer.js # Footer implementation
│   │   │   │   ├── Footer.test.js # Footer tests
│   │   │   │   └── index.js  # Footer export
│   │   │   │
│   │   │   ├── Layout/       # Main layout
│   │   │   │   ├── Layout.js # Layout implementation
│   │   │   │   ├── AuthLayout.js # Auth pages layout
│   │   │   │   ├── DashboardLayout.js # Dashboard layout
│   │   │   │   ├── PublicLayout.js # Public pages layout
│   │   │   │   ├── Layout.test.js # Layout tests
│   │   │   │   └── index.js  # Layout export
│   │   │   │
│   │   │   ├── PageHeader/   # Page header component
│   │   │   │   ├── PageHeader.js # PageHeader implementation
│   │   │   │   ├── PageHeader.test.js # PageHeader tests
│   │   │   │   └── index.js  # PageHeader export
│   │   │   │
│   │   │   ├── Breadcrumbs/  # Breadcrumbs component
│   │   │   │   ├── Breadcrumbs.js # Breadcrumbs implementation
│   │   │   │   ├── Breadcrumbs.test.js # Breadcrumbs tests
│   │   │   │   └── index.js  # Breadcrumbs export
│   │   │   │
│   │   │   └── index.js      # Export all layout components
│   │   │
│   │   ├── dashboard/        # Dashboard components
│   │   │   ├── StatCard/     # Stat card component
│   │   │   │   ├── StatCard.js # StatCard implementation
│   │   │   │   ├── StatCard.test.js # StatCard tests
│   │   │   │   └── index.js  # StatCard export
│   │   │   │
│   │   │   ├── ActivityFeed/ # Activity feed component
│   │   │   │   ├── ActivityFeed.js # ActivityFeed implementation
│   │   │   │   ├── ActivityItem.js # Activity item
│   │   │   │   ├── ActivityFeed.test.js # ActivityFeed tests
│   │   │   │   └── index.js  # ActivityFeed export
│   │   │   │
│   │   │   ├── DashboardHeader/ # Dashboard header
│   │   │   │   ├── DashboardHeader.js # DashboardHeader implementation
│   │   │   │   ├── DashboardHeader.test.js # DashboardHeader tests
│   │   │   │   └── index.js  # DashboardHeader export
│   │   │   │
│   │   │   ├── BloodTypeChart/ # Blood type chart
│   │   │   │   ├── BloodTypeChart.js # BloodTypeChart implementation
│   │   │   │   ├── BloodTypeChart.test.js # BloodTypeChart tests
│   │   │   │   └── index.js  # BloodTypeChart export
│   │   │   │
│   │   │   ├── RecentDonations/ # Recent donations
│   │   │   │   ├── RecentDonations.js # RecentDonations implementation
│   │   │   │   ├── RecentDonations.test.js # RecentDonations tests
│   │   │   │   └── index.js  # RecentDonations export
│   │   │   │
│   │   │   ├── DonationTrends/ # Donation trends chart
│   │   │   │   ├── DonationTrends.js # DonationTrends implementation
│   │   │   │   ├── DonationTrends.test.js # DonationTrends tests
│   │   │   │   └── index.js  # DonationTrends export
│   │   │   │
│   │   │   ├── QuickActions/ # Quick actions component
│   │   │   │   ├── QuickActions.js # QuickActions implementation
│   │   │   │   ├── QuickActionButton.js # QuickAction button
│   │   │   │   ├── QuickActions.test.js # QuickActions tests
│   │   │   │   └── index.js  # QuickActions export
│   │   │   │
│   │   │   └── index.js      # Export all dashboard components
│   │   │
│   │   ├── donations/        # Donation components
│   │   │   ├── DonationCard/ # Donation card component
│   │   │   │   ├── DonationCard.js # DonationCard implementation
│   │   │   │   ├── DonationCardHeader.js # DonationCard header
│   │   │   │   ├── DonationCardBody.js # DonationCard body
│   │   │   │   ├── DonationCardFooter.js # DonationCard footer
│   │   │   │   ├── DonationCard.test.js # DonationCard tests
│   │   │   │   └── index.js  # DonationCard export
│   │   │   │
│   │   │   ├── DonationForm/ # Donation form component
│   │   │   │   ├── DonationForm.js # DonationForm implementation
│   │   │   │   ├── DonorInfoSection.js # Donor info section
│   │   │   │   ├── DonationInfoSection.js # Donation info section
│   │   │   │   ├── DonationForm.test.js # DonationForm tests
│   │   │   │   └── index.js  # DonationForm export
│   │   │   │
│   │   │   ├── DonationList/ # Donation list component
│   │   │   │   ├── DonationList.js # DonationList implementation
│   │   │   │   ├── DonationListItem.js # DonationList item
│   │   │   │   ├── DonationList.test.js # DonationList tests
│   │   │   │   └── index.js  # DonationList export
│   │   │   │
│   │   │   ├── DonationFilter/ # Donation filter component
│   │   │   │   ├── DonationFilter.js # DonationFilter implementation
│   │   │   │   ├── DateRangeFilter.js # Date range filter
│   │   │   │   ├── BloodTypeFilter.js # Blood type filter
│   │   │   │   ├── StatusFilter.js # Status filter
│   │   │   │   ├── DonationFilter.test.js # DonationFilter tests
│   │   │   │   └── index.js  # DonationFilter export
│   │   │   │
│   │   │   ├── DonationSearch/ # Donation search component
│   │   │   │   ├── DonationSearch.js # DonationSearch implementation
│   │   │   │   ├── DonationSearch.test.js # DonationSearch tests
│   │   │   │   └── index.js  # DonationSearch export
│   │   │   │
│   │   │   ├── VerifyModal/ # Verification modal
│   │   │   │   ├── VerifyModal.js # VerifyModal implementation
│   │   │   │   ├── VerifyForm.js # Verification form
│   │   │   │   ├── VerifyModal.test.js # VerifyModal tests
│   │   │   │   └── index.js  # VerifyModal export
│   │   │   │
│   │   │   ├── DonationStatusBadge/ # Donation status badge
│   │   │   │   ├── DonationStatusBadge.js # DonationStatusBadge implementation
│   │   │   │   ├── DonationStatusBadge.test.js # DonationStatusBadge tests
│   │   │   │   └── index.js  # DonationStatusBadge export
│   │   │   │
│   │   │   ├── DonationSummary/ # Donation summary
│   │   │   │   ├── DonationSummary.js # DonationSummary implementation
│   │   │   │   ├── DonationSummary.test.js # DonationSummary tests
│   │   │   │   └── index.js  # DonationSummary export
│   │   │   │
│   │   │   └── index.js      # Export all donation components
│   │   │
│   │   ├── blockchain/       # Blockchain components
│   │   │   ├── HiveConnect/ # Hive connection component
│   │   │   │   ├── HiveConnect.js # HiveConnect implementation
│   │   │   │   ├── ConnectModal.js # Connection modal
│   │   │   │   ├── HiveConnect.test.js # HiveConnect tests
│   │   │   │   └── index.js  # HiveConnect export
│   │   │   │
│   │   │   ├── TransactionList/ # Transaction list component
│   │   │   │   ├── TransactionList.js # TransactionList implementation
│   │   │   │   ├── TransactionItem.js # Transaction item
│   │   │   │   ├── TransactionList.test.js # TransactionList tests
│   │   │   │   └── index.js  # TransactionList export
│   │   │   │
│   │   │   ├── NFTCard/      # NFT card component
│   │   │   │   ├── NFTCard.js # NFTCard implementation
│   │   │   │   ├── NFTCard.test.js # NFTCard tests
│   │   │   │   └── index.js  # NFTCard export
│   │   │   │
│   │   │   ├── NFTGenerator/ # NFT generator component
│   │   │   │   ├── NFTGenerator.js # NFTGenerator implementation
│   │   │   │   ├── TemplateSelector.js # Template selector
│   │   │   │   ├── NFTPreview.js # NFT preview
│   │   │   │   ├── NFTGenerator.test.js # NFTGenerator tests
│   │   │   │   └── index.js  # NFTGenerator export
│   │   │   │
│   │   │   ├── BlockchainStatus/ # Blockchain status component
│   │   │   │   ├── BlockchainStatus.js # BlockchainStatus implementation
│   │   │   │   ├── BlockchainStatus.test.js # BlockchainStatus tests
│   │   │   │   └── index.js  # BlockchainStatus export
│   │   │   │
│   │   │   ├── TransactionViewer/ # Transaction viewer component
│   │   │   │   ├── TransactionViewer.js # TransactionViewer implementation
│   │   │   │   ├── TransactionViewer.test.js # TransactionViewer tests
│   │   │   │   └── index.js  # TransactionViewer export
│   │   │   │
│   │   │   └── index.js      # Export all blockchain components
│   │   │
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm/    # Login form component
│   │   │   │   ├── LoginForm.js # LoginForm implementation
│   │   │   │   ├── LoginForm.test.js # LoginForm tests
│   │   │   │   └── index.js  # LoginForm export
│   │   │   │
│   │   │   ├── RegisterForm/ # Register form component
│   │   │   │   ├── RegisterForm.js # RegisterForm implementation
│   │   │   │   ├── RegisterForm.test.js # RegisterForm tests
│   │   │   │   └── index.js  # RegisterForm export
│   │   │   │
│   │   │   ├── ForgotPasswordForm/ # Forgot password form
│   │   │   │   ├── ForgotPasswordForm.js # ForgotPasswordForm implementation
│   │   │   │   ├── ForgotPasswordForm.test.js # ForgotPasswordForm tests
│   │   │   │   └── index.js  # ForgotPasswordForm export
│   │   │   │
│   │   │   ├── ResetPasswordForm/ # Reset password form
│   │   │   │   ├── ResetPasswordForm.js # ResetPasswordForm implementation
│   │   │   │   ├── ResetPasswordForm.test.js # ResetPasswordForm tests
│   │   │   │   └── index.js  # ResetPasswordForm export
│   │   │   │
│   │   │   └── index.js      # Export all auth components
│   │   │
│   │   └── index.js          # Export all components
│   │
│   ├── context/              # React Context API
│   │   ├── AuthContext.js    # Authentication context
│   │   ├── DonationContext.js # Donation data context
│   │   ├── HospitalContext.js # Hospital data context
│   │   ├── BlockchainContext.js # Blockchain data context
│   │   ├── ThemeContext.js   # UI theme context
│   │   ├── NotificationContext.js # Notifications context
│   │   ├── SearchContext.js  # Search context
│   │   ├── UIContext.js      # UI state context (sidebar, etc.)
│   │   └── index.js          # Export all contexts
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js        # Authentication hook
│   │   ├── useHiveKeychain.js # Hive Keychain integration hook
│   │   ├── useLocalStorage.js # LocalStorage hook
│   │   ├── useDonations.js   # Donations data hook
│   │   ├── useHospital.js    # Hospital data hook
│   │   ├── useNFTs.js        # NFT management hook
│   │   ├── usePagination.js  # Pagination hook
│   │   ├── useFilter.js      # Data filtering hook
│   │   ├── useSort.js        # Data sorting hook
│   │   ├── useToast.js       # Toast notification hook
│   │   ├── useMediaQuery.js  # Media query hook
│   │   ├── useClickOutside.js # Click outside hook
│   │   ├── useDebounce.js    # Debounce hook
│   │   ├── useForm.js        # Form handling hook
│   │   ├── useAsync.js       # Async operation hook
│   │   ├── useSearch.js      # Search hook
│   │   ├── useBlockchainTransaction.js # Blockchain transaction hook
│   │   └── index.js          # Export all hooks
│   │
│   ├── pages/                # Application pages
│   │   ├── auth/             # Authentication pages
│   │   │   ├── Login.js      # Login page
│   │   │   ├── Register.js   # Registration page
│   │   │   ├── ForgotPassword.js # Forgot password page
│   │   │   ├── ResetPassword.js # Reset password page
│   │   │   └── index.js      # Export auth pages
│   │   │
│   │   ├── dashboard/        # Dashboard pages
│   │   │   ├── HospitalDashboard.js # Hospital dashboard
│   │   │   ├── DonorDashboard.js # Donor dashboard
│   │   │   ├── AdminDashboard.js # Admin dashboard
│   │   │   └── index.js      # Export dashboard pages
│   │   │
│   │   ├── donations/        # Donation pages
│   │   │   ├── DonationsList.js # Donations list page
│   │   │   ├── DonationDetails.js # Single donation details
│   │   │   ├── AddDonation.js # Add new donation page
│   │   │   ├── EditDonation.js # Edit donation page
│   │   │   ├── VerifyDonation.js # Verify donation page
│   │   │   └── index.js      # Export donation pages
│   │   │
│   │   ├── nft/              # NFT-related pages
│   │   │   ├── NFTGallery.js # NFT gallery page
│   │   │   ├── NFTDetails.js # Single NFT details
│   │   │   ├── IssueNFT.js   # Issue NFT page
│   │   │   └── index.js      # Export NFT pages
│   │   │
│   │   ├── settings/         # Settings pages
│   │   │   ├── Profile.js    # User profile page
│   │   │   ├── HospitalSettings.js # Hospital settings
│   │   │   ├── Security.js   # Security settings
│   │   │   ├── Notifications.js # Notification settings
│   │   │   ├── Blockchain.js # Blockchain settings
│   │   │   └── index.js      # Export settings pages
│   │   │
│   │   ├── reports/          # Report pages
│   │   │   ├── DonationReports.js # Donation reports
│   │   │   ├── BlockchainReports.js # Blockchain reports
│   │   │   ├── AnalyticsReports.js # Analytics reports
│   │   │   └── index.js      # Export report pages
│   │   │
│   │   ├── Home.js           # Landing page
│   │   ├── About.js          # About page
│   │   ├── Contact.js        # Contact page
│   │   ├── PrivacyPolicy.js  # Privacy policy page
│   │   ├── TermsOfService.js # Terms of service page
│   │   ├── NotFound.js       # 404 page
│   │   └── index.js          # Export all pages
│   │
│   ├── services/             # External services
│   │   ├── api/              # API services
│   │   │   ├── auth.js       # Authentication API
│   │   │   ├── donations.js  # Donations API
│   │   │   ├── hospitals.js  # Hospitals API
│   │   │   ├── nfts.js       # NFTs API
│   │   │   ├── users.js      # Users API
│   │   │   ├── analytics.js  # Analytics API
│   │   │   ├── reports.js    # Reports API
│   │   │   ├── axios.js      # Axios instance config
│   │   │   └── index.js      # Export all API services
│   │   │
│   │   ├── blockchain/       # Blockchain services
│   │   │   ├── hive.js       # Hive blockchain integration
│   │   │   ├── keychain.js   # Hive Keychain service
│   │   │   ├── nft.js        # NFT creation service
│   │   │   ├── transactions.js # Transaction service
│   │   │   ├── verifier.js   # Blockchain verification service
│   │   │   └── index.js      # Export all blockchain services
│   │   │
│   │   ├── storage/          # Storage services
│   │   │   ├── localStorage.js # LocalStorage service
│   │   │   ├── sessionStorage.js # SessionStorage service
│   │   │   └── index.js      # Export all storage services
│   │   │
│   │   ├── analytics/        # Analytics services
│   │   │   ├── analytics.js  # Analytics service
│   │   │   ├── events.js     # Event tracking
│   │   │   └── index.js      # Export analytics services
│   │   │
│   │   ├── notification/     # Notification services
│   │   │   ├── toast.js      # Toast notification service
│   │   │   ├── push.js       # Push notification service
│   │   │   └── index.js      # Export notification services
│   │   │
│   │   └── index.js          # Export all services
│   │
│   ├── utils/                # Utility functions
│   │   ├── formatters/       # Formatting utilities
│   │   │   ├── dateFormatter.js # Date formatting
│   │   │   │   ├── numberFormatter.js # Number formatting
│   │   │   │   ├── stringFormatter.js # String formatting
│   │   │   │   └── index.js      # Export formatters
│   │   │   │
│   │   │   ├── validators/       # Validation utilities
│   │   │   │   ├── authValidator.js # Auth validation
│   │   │   │   ├── donationValidator.js # Donation validation
│   │   │   │   ├── formValidator.js # Form validation
│   │   │   │   └── index.js      # Export validators
│   │   │   │
│   │   │   ├── constants.js      # Application constants
│   │   │   ├── helpers.js        # Helper functions
│   │   │   ├── storage.js        # Storage utilities
│   │   │   ├── theme.js          # Theme utilities
│   │   │   ├── routes.js         # Route constants
│   │   │   ├── permissions.js    # Permission utilities
│   │   │   ├── tests.js          # Test utilities
│   │   │   ├── encryption.js     # Encryption utilities
│   │   │   ├── dataTransformers.js # Data transformation utilities
│   │   │   ├── apiErrorHandler.js # API error handling
│   │   │   ├── bloodTypes.js     # Blood type utilities
│   │   │   ├── mockData.js       # Mock data for development
│   │   │   └── index.js          # Export all utilities
│   │   │
│   │   ├── App.js                # Main App component
│   │   ├── AppProviders.js       # All context providers wrapper
│   │   ├── index.js              # Application entry point
│   │   └── router.js             # Router configuration
│   │
│   ├── tests/                    # Test configuration
│   │   ├── setup.js              # Test setup
│   │   ├── mocks/                # Test mocks
│   │   │   ├── handlers.js       # MSW handlers
│   │   │   ├── server.js         # MSW server
│   │   │   ├── api.js            # API mocks
│   │   │   └── blockchain.js     # Blockchain mocks
│   │   └── utils/                # Test utilities
│   │
│   ├── .env.development          # Development environment variables
│   ├── .env.production           # Production environment variables
│   ├── .env.test                 # Test environment variables
│   ├── .env.example              # Example environment variables
│   ├── package.json              # NPM package configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   ├── jsconfig.json             # JavaScript configuration
│   └── README.md                 # Frontend README
│
├── server/                       # Backend application
│   ├── config/                   # Configuration files
│   │   ├── database.js           # Database configuration
│   │   ├── hive.js               # Hive blockchain configuration
│   │   ├── auth.js               # Authentication configuration
│   │   ├── cors.js               # CORS configuration
│   │   ├── logging.js            # Logging configuration
│   │   ├── swagger.js            # API documentation configuration
│   │   ├── email.js              # Email configuration
│   │   ├── storage.js            # File storage configuration
│   │   ├── cache.js              # Cache configuration
│   │   ├── env.js                # Environment variables
│   │   └── index.js              # Export all configurations
│   │
│   ├── controllers/              # API controllers
│   │   ├── authController.js     # Authentication controller
│   │   ├── userController.js     # User management controller
│   │   ├── donationController.js # Donations controller
│   │   ├── hospitalController.js # Hospitals controller
│   │   ├── nftController.js      # NFTs controller
│   │   ├── blockchainController.js # Blockchain controller
│   │   ├── analyticsController.js # Analytics controller
│   │   ├── reportController.js   # Reports controller
│   │   ├── settingsController.js # Settings controller
│   │   ├── uploadController.js   # File upload controller
│   │   ├── webhookController.js  # Webhook controller
│   │   └── index.js              # Export all controllers
│   │
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # Authentication middleware
│   │   ├── validation.js         # Input validation middleware
│   │   ├── errorHandler.js       # Error handling middleware
│   │   ├── logger.js             # Request logging middleware
│   │   ├── rateLimiter.js        # Rate limiting middleware
│   │   ├── cors.js               # CORS middleware
│   │   ├── fileUpload.js         # File upload middleware
│   │   ├── sanitize.js           # Input sanitization
│   │   ├── cache.js              # Response caching
│   │   ├── metrics.js            # Performance metrics
│   │   ├── limiter.js            # Request limiting
│   │   ├── permissions.js        # Role-based permissions
│   │   └── index.js              # Export all middleware
│   │
│   ├── models/                   # Data models
│   │   ├── User.js               # User model
│   │   ├── Hospital.js           # Hospital model
│   │   ├── Donation.js           # Donation model
│   │   ├── NFT.js                # NFT model
│   │   ├── Transaction.js        # Blockchain transaction model
│   │   ├── Role.js               # User role model
│   │   ├── Permission.js         # Permission model
│   │   ├── Verification.js       # Verification record model
│   │   ├── Notification.js       # Notification model
│   │   ├── Setting.js            # Settings model
│   │   ├── Log.js                # Application log model
│   │   ├── Report.js             # Report model
│   │   ├── Session.js            # User session model
│   │   ├── Token.js              # Authentication token model
│   │   ├── File.js               # Uploaded file model
│   │   └── index.js              # Export all models
│   │
│   ├── routes/                   # API routes
│   │   ├── authRoutes.js         # Authentication routes
│   │   ├── userRoutes.js         # User management routes
│   │   ├── donationRoutes.js     # Donations routes
│   │   ├── hospitalRoutes.js     # Hospitals routes
│   │   ├── nftRoutes.js          # NFTs routes
│   │   ├── blockchainRoutes.js   # Blockchain routes
│   │   ├── analyticsRoutes.js    # Analytics routes
│   │   ├── reportRoutes.js       # Reports routes
│   │   ├── settingsRoutes.js     # Settings routes
│   │   ├── uploadRoutes.js       # File upload routes
│   │   ├── webhookRoutes.js      # Webhook routes
│   │   ├── adminRoutes.js        # Admin management routes
│   │   └── index.js              # Export all routes
│   │
│   ├── services/                 # Business logic services
│   │   ├── authService.js        # Authentication service
│   │   ├── userService.js        # User management service
│   │   ├── donationService.js    # Donations service
│   │   ├── hospitalService.js    # Hospitals service
│   │   ├── nftService.js         # NFTs service
│   │   ├── blockchainService.js  # Blockchain service
│   │   ├── emailService.js       # Email service
│   │   ├── analyticsService.js   # Analytics service
│   │   ├── reportService.js      # Reports service
│   │   ├── notificationService.js # Notification service
│   │   ├── fileService.js        # File storage service
│   │   ├── webhookService.js     # Webhook service
│   │   ├── cacheService.js       # Caching service
│   │   ├── searchService.js      # Search service
│   │   ├── logService.js         # Logging service
│   │   ├── exportService.js      # Data export service
│   │   ├── importService.js      # Data import service
│   │   ├── cryptoService.js      # Cryptography service
│   │   └── index.js              # Export all services
│   │
│   ├── utils/                    # Utility functions
│   │   ├── formatters.js         # Data formatting utilities
│   │   ├── validators.js         # Input validation functions
│   │   ├── constants.js          # Application constants
│   │   ├── helpers.js            # Helper functions
│   │   ├── hiveUtils.js          # Hive blockchain utilities
│   │   ├── dateUtils.js          # Date manipulation utilities
│   │   ├── stringUtils.js        # String manipulation utilities
│   │   ├── fileUtils.js          # File handling utilities
│   │   ├── encryption.js         # Encryption utilities
│   │   ├── errorCodes.js         # Error code definitions
│   │   ├── apiResponse.js        # API response formatter
│   │   ├── pagination.js         # Pagination utilities
│   │   ├── sorting.js            # Sorting utilities
│   │   ├── filtering.js          # Filtering utilities
│   │   ├── logging.js            # Logging utilities
│   │   ├── performance.js        # Performance measurement
│   │   ├── security.js           # Security utilities
│   │   ├── emailTemplates.js     # Email template utilities
│   │   ├── nftGenerators.js      # NFT generation utilities
│   │   └── index.js              # Export all utilities
│   │
│   ├── database/                 # Database configuration
│   │   ├── migrations/           # Database migrations
│   │   │   ├── 001_create_users.js # Create users table
│   │   │   ├── 002_create_hospitals.js # Create hospitals table
│   │   │   ├── 003_create_donations.js # Create donations table
│   │   │   ├── 004_create_nfts.js # Create NFTs table
│   │   │   └── ...               # Other migrations
│   │   │
│   │   ├── seeders/              # Database seeders
│   │   │   ├── 001_seed_roles.js # Seed roles data
│   │   │   ├── 002_seed_permissions.js # Seed permissions data
│   │   │   ├── 003_seed_admin_user.js # Seed admin user
│   │   │   └── ...               # Other seeders
│   │   │
│   │   ├── connection.js         # Database connection
│   │   ├── models.js             # ORM model setup
│   │   └── index.js              # Database initialization
│   │
│   ├── api/                      # API documentation
│   │   ├── schemas/              # API schemas
│   │   │   ├── auth.schema.js    # Auth schemas
│   │   │   ├── user.schema.js    # User schemas
│   │   │   ├── donation.schema.js # Donation schemas
│   │   │   ├── hospital.schema.js # Hospital schemas
│   │   │   ├── nft.schema.js     # NFT schemas
│   │   │   └── ...               # Other schemas
│   │   │
│   │   ├── docs/                 # OpenAPI documentation
│   │   │   ├── auth.docs.js      # Auth API docs
│   │   │   ├── user.docs.js      # User API docs
│   │   │   ├── donation.docs.js  # Donation API docs
│   │   │   ├── hospital.docs.js  # Hospital API docs
│   │   │   ├── nft.docs.js       # NFT API docs
│   │   │   └── ...               # Other API docs
│   │   │
│   │   └── index.js              # API docs setup
│   │
│   ├── templates/                # Email and notification templates
│   │   ├── emails/               # Email templates
│   │   │   ├── welcome.html      # Welcome email
│   │   │   ├── donation-confirmation.html # Donation confirmation
│   │   │   ├── verification-complete.html # Verification complete
│   │   │   ├── nft-issued.html   # NFT issued
│   │   │   ├── reset-password.html # Reset password
│   │   │   └── ...               # Other email templates
│   │   │
│   │   ├── notifications/        # Notification templates
│   │   │   ├── new-donation.html # New donation notification
│   │   │   ├── verification-required.html # Verification required
│   │   │   └── ...               # Other notification templates
│   │   │
│   │   └── pdf/                  # PDF templates
│   │       ├── donation-certificate.html # Donation certificate
│   │       ├── nft-certificate.html # NFT certificate
│   │       └── ...               # Other PDF templates
│   │
│   ├── scripts/                  # Server scripts
│   │   ├── db-backup.js          # Database backup script
│   │   ├── db-restore.js         # Database restore script
│   │   ├── data-migration.js     # Data migration script
│   │   ├── blockchain-sync.js    # Blockchain synchronization
│   │   ├── generate-sitemap.js   # Sitemap generation
│   │   ├── clean-logs.js         # Log cleaning script
│   │   └── ...                   # Other utility scripts
│   │
│   ├── tests/                    # Server tests
│   │   ├── unit/                 # Unit tests
│   │   │   ├── controllers/      # Controller tests
│   │   │   ├── services/         # Service tests
│   │   │   ├── models/           # Model tests
│   │   │   ├── utils/            # Utility tests
│   │   │   └── middleware/       # Middleware tests
│   │   │
│   │   ├── integration/          # Integration tests
│   │   │   ├── api/              # API tests
│   │   │   ├── database/         # Database tests
│   │   │   └── blockchain/       # Blockchain tests
│   │   │
│   │   ├── e2e/                  # End-to-end tests
│   │   ├── mocks/                # Test mocks
│   │   ├── fixtures/             # Test fixtures
│   │   ├── setup.js              # Test setup
│   │   └── helpers.js            # Test helpers
│   │
│   ├── logs/                     # Server logs
│   │   ├── access.log            # Access logs
│   │   ├── error.log             # Error logs
│   │   ├── blockchain.log        # Blockchain logs
│   │   └── debug.log             # Debug logs
│   │
│   ├── .env.development          # Development environment variables
│   ├── .env.production           # Production environment variables
│   ├── .env.test                 # Test environment variables
│   ├── .env.example              # Example environment variables
│   ├── package.json              # NPM package configuration
│   ├── nodemon.json              # Nodemon configuration
│   ├── tsconfig.json             # TypeScript configuration (if using TS)
│   ├── server.js                 # Entry point for the server
│   ├── app.js                    # Express application setup
│   └── README.md                 # Backend README
│
├── docs/                         # Documentation
│   ├── api/                      # API documentation
│   │   ├── auth.md               # Authentication API docs
│   │   ├── users.md              # Users API docs
│   │   ├── donations.md          # Donations API docs
│   │   ├── hospitals.md          # Hospitals API docs
│   │   ├── nfts.md               # NFTs API docs
│   │   ├── blockchain.md         # Blockchain API docs
│   │   ├── analytics.md          # Analytics API docs
│   │   ├── reports.md            # Reports API docs
│   │   ├── upload.md             # Upload API docs
│   │   └── webhooks.md           # Webhooks API docs
│   │
│   ├── blockchain/               # Blockchain documentation
│   │   ├── hive-integration.md   # Hive blockchain integration
│   │   ├── keychain-usage.md     # Hive Keychain usage
│   │   ├── custom-json-ops.md    # Custom JSON operations
│   │   ├── nft-structure.md      # NFT structure
│   │   └── transactions.md       # Transaction types
│   │
│   ├── frontend/                 # Frontend documentation
│   │   ├── components.md         # Component documentation
│   │   ├── hooks.md              # Custom hooks
│   │   ├── contexts.md           # Context API usage
│   │   ├── styling.md            # Styling approach
│   │   └── state-management.md   # State management
│   │
│   ├── backend/                  # Backend documentation
│   │   ├── architecture.md       # Server architecture
│   │   ├── data-models.md        # Data models
│   │   ├── api-design.md         # API design
│   │   ├── authentication.md     # Authentication system
│   │   ├── validation.md         # Validation strategy
│   │   └── error-handling.md     # Error handling
│   │
│   ├── devops/                   # DevOps documentation
│   │   ├── deployment.md         # Deployment guide
│   │   ├── ci-cd.md              # CI/CD pipelines
│   │   ├── monitoring.md         # Monitoring setup
│   │   ├── security.md           # Security measures
│   │   └── scaling.md            # Scaling strategy
│   │
│   ├── architecture.md           # Overall architecture overview
│   ├── getting-started.md        # Getting started guide
│   ├── contributing.md           # Contributing guidelines
│   ├── code-style.md             # Code style guidelines
│   ├── testing.md                # Testing strategy
│   ├── security-considerations.md # Security considerations
│   └── roadmap.md                # Future development roadmap
│
├── docker/                       # Docker configuration
│   ├── client/                   # Client Docker configs
│   │   ├── Dockerfile            # Client Dockerfile
│   │   └── nginx.conf            # Nginx configuration
│   │
│   ├── server/                   # Server Docker configs
│   │   ├── Dockerfile            # Server Dockerfile
│   │   └── entrypoint.sh         # Container entrypoint script
│   │
│   ├── database/                 # Database Docker configs
│   │   ├── Dockerfile            # Database Dockerfile
│   │   ├── init.sql              # Database initialization
│   │   └── config.cnf            # Database configuration
│   │
│   ├── docker-compose.yml        # Development Docker Compose
│   ├── docker-compose.prod.yml   # Production Docker Compose
│   └── .dockerignore             # Docker ignore file
│
├── .github/                      # GitHub configurations
│   ├── workflows/                # GitHub Actions workflows
│   │   ├── client-ci.yml         # Client CI workflow
│   │   ├── server-ci.yml         # Server CI workflow
│   │   ├── deploy-staging.yml    # Staging deployment
│   │   ├── deploy-production.yml # Production deployment
│   │   └── dependabot.yml        # Dependabot configuration
│   │
│   ├── ISSUE_TEMPLATE/           # Issue templates
│   │   ├── bug_report.md         # Bug report template
│   │   ├── feature_request.md    # Feature request template
│   │   └── question.md           # Question template
│   │
│   └── PULL_REQUEST_TEMPLATE.md  # PR template
│
├── scripts/                      # Project scripts
│   ├── setup.sh                  # Project setup script
│   ├── dev.sh                    # Development script
│   ├── build.sh                  # Build script
│   ├── deploy.sh                 # Deployment script
│   ├── backup.sh                 # Database backup script
│   ├── lint.sh                   # Linting script
│   ├── test.sh                   # Testing script
│   └── clean.sh                  # Cleanup script
│
├── tools/                        # Development tools
│   ├── generators/               # Code generators
│   │   ├── component.js          # Component generator
│   │   ├── service.js            # Service generator
│   │   ├── model.js              # Model generator
│   │   └── api.js                # API generator
│   │
│   ├── mocks/                    # Mock data generators
│   │   ├── donations.js          # Donation mocks
│   │   ├── users.js              # User mocks
│   │   └── blockchain.js         # Blockchain mocks
│   │
│   └── scripts/                  # Utility scripts
│       ├── analyze-bundle.js     # Bundle analyzer
│       ├── update-deps.js        # Dependencies updater
│       └── generate-docs.js      # Documentation generator
│
├── .vscode/                      # VS Code settings
│   ├── settings.json             # Editor settings
│   ├── extensions.json           # Recommended extensions
│   ├── launch.json               # Debugger configuration
│   └── snippets/                 # Code snippets
│
├── .editorconfig                 # Editor configuration
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .gitignore                    # Git ignore rules
├── .env.example                  # Root environment variables
├── package.json                  # Root package.json
├── lerna.json                    # Lerna configuration (if monorepo)
├── LICENSE                       # Project license
└── README.md                     # Project README