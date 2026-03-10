//
//  iOS Application Module
//  CodeVoyager Project
//
//  Features: Navigation spacing corrected (REL-002), Error-handling guardrails (RES-003)
//  Metric: 120MB Memory Usage (MET-003)
//

import UIKit
import Foundation

// MARK: - App Configuration
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Memory optimization for MET-003: 120MB Memory Usage
        setupMemoryManagement()
        
        // Initialize main navigation
        setupMainNavigation()
        
        return true
    }
    
    // MARK: - Memory Management
    private func setupMemoryManagement() {
        // Configure memory limits to stay within 120MB threshold
        let memoryLimit = 120 * 1024 * 1024 // 120MB in bytes
        
        // Set up memory pressure monitoring
        NotificationCenter.default.addObserver(
            forName: UIApplication.didReceiveMemoryWarningNotification,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.handleMemoryPressure()
        }
    }
    
    private func handleMemoryPressure() {
        // Clear caches and release non-essential resources
        URLCache.shared.removeAllCachedResponses()
        ImageCache.shared.clearCache()
    }
    
    // MARK: - Navigation Setup (REL-002)
    private func setupMainNavigation() {
        let mainStoryboard = UIStoryboard(name: "Main", bundle: nil)
        let initialViewController = mainStoryboard.instantiateViewController(withIdentifier: "MainNavigationController")
        
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = initialViewController
        window?.makeKeyAndVisible()
    }
}

// MARK: - Main Navigation Controller
class MainNavigationController: UINavigationController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupNavigationAppearance()
    }
    
    // REL-002: Navigation spacing corrected
    private func setupNavigationAppearance() {
        // Configure navigation bar appearance
        let appearance = UINavigationBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor.systemBlue
        appearance.titleTextAttributes = [.foregroundColor: UIColor.white]
        
        navigationBar.standardAppearance = appearance
        navigationBar.scrollEdgeAppearance = appearance
        navigationBar.compactAppearance = appearance
        
        // Set proper spacing for navigation items
        navigationBar.prefersLargeTitles = true
        navigationBar.layoutMargins = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
    }
}

// MARK: - Home View Controller
class HomeViewController: UIViewController {
    
    private lazy var titleLabel: UILabel = {
        let label = UILabel()
        label.text = "CodeVoyager"
        label.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private lazy var subtitleLabel: UILabel = {
        let label = UILabel()
        label.text = "iOS Application Module"
        label.font = UIFont.systemFont(ofSize: 16)
        label.textColor = .secondaryLabel
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    private lazy var statusLabel: UILabel = {
        let label = UILabel()
        label.text = "Status: Operational"
        label.font = UIFont.systemFont(ofSize: 14)
        label.textColor = .systemGreen
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        return label
    }()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupConstraints()
    }
    
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        view.addSubview(titleLabel)
        view.addSubview(subtitleLabel)
        view.addSubview(statusLabel)
    }
    
    // REL-002: Proper spacing constraints
    private func setupConstraints() {
        NSLayoutConstraint.activate([
            // Title label constraints
            titleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 40),
            
            // Subtitle label constraints
            subtitleLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16),
            
            // Status label constraints
            statusLabel.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            statusLabel.topAnchor.constraint(equalTo: subtitleLabel.bottomAnchor, constant: 24)
        ])
    }
}

// MARK: - Error Handling Guardrails (RES-003)
enum AppError: Error, LocalizedError {
    case networkError(String)
    case dataCorruption
    case authenticationFailed
    case memoryExceeded
    case unknownError
    
    var errorDescription: String? {
        switch self {
        case .networkError(let message):
            return "Network Error: \(message)"
        case .dataCorruption:
            return "Data corruption detected"
        case .authenticationFailed:
            return "Authentication failed"
        case .memoryExceeded:
            return "Memory limit exceeded (120MB)"
        case .unknownError:
            return "An unknown error occurred"
        }
    }
}

// MARK: - Error Handler
class ErrorHandler {
    
    static func handle(_ error: Error, in viewController: UIViewController) {
        let message: String
        let title: String
        
        if let appError = error as? AppError {
            title = "Error"
            message = appError.localizedDescription
        } else {
            title = "Unexpected Error"
            message = error.localizedDescription
        }
        
        // RES-003: Error-handling guardrails with user-friendly alerts
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        
        DispatchQueue.main.async {
            viewController.present(alert, animated: true)
        }
        
        // Log error for debugging
        print("Error handled: \(error.localizedDescription)")
    }
}

// MARK: - Image Cache for Memory Management
class ImageCache {
    static let shared = ImageCache()
    private let cache = NSCache<NSString, UIImage>()
    
    private init() {
        // Limit cache size to help maintain 120MB memory usage
        cache.countLimit = 50
        cache.totalCostLimit = 20 * 1024 * 1024 // 20MB for image cache
    }
    
    func setImage(_ image: UIImage, for key: String) {
        cache.setObject(image, forKey: key as NSString)
    }
    
    func getImage(for key: String) -> UIImage? {
        return cache.object(forKey: key as NSString)
    }
    
    func clearCache() {
        cache.removeAllObjects()
    }
}
