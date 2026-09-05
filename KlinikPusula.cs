using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Windows.Forms;

namespace KlinikPusulaApp
{
    public class MainForm : Form
    {
        private NotifyIcon trayIcon;
        private ContextMenu trayMenu;
        private Process backendProcess;
        private const int AppPort = 3000;
        private static readonly string AppUrl = "http://localhost:" + AppPort;
        private Label lblStatus;
        private Button btnOpenBrowser;
        private Button btnStop;
        private System.Windows.Forms.Timer pollTimer;
        private int pollRetries = 0;

        public MainForm()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            try
            {
                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "MainForm constructor: InitializeComponent basliyor\n");
                InitializeComponent();
                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "MainForm constructor: InitializeComponent bitti\n");

                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "MainForm constructor: StartServer basliyor\n");
                StartServer();
                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "MainForm constructor: StartServer bitti\n");
            }
            catch (Exception ex)
            {
                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "HATA MainForm constructor: " + ex + "\n");
                throw;
            }
        }

        private void InitializeComponent()
        {
            this.Text = "KlinikPusula — Dr. Ekrem Kasapoğlu";
            this.Size = new Size(460, 320);
            this.FormBorderStyle = FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(248, 250, 252); // Slate 50

            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string icoPath = Path.Combine(baseDir, "consensus.ico");
            if (File.Exists(icoPath))
            {
                try { this.Icon = new Icon(icoPath); } catch { }
            }

            // Top Header Panel
            Panel headerPanel = new Panel
            {
                Dock = DockStyle.Top,
                Height = 85,
                BackColor = Color.FromArgb(15, 23, 42) // Slate 900
            };

            Label lblTitle = new Label
            {
                Text = "KlinikPusula",
                Font = new Font("Segoe UI", 16, FontStyle.Bold),
                ForeColor = Color.White,
                Location = new Point(20, 15),
                AutoSize = true
            };

            Label lblSubtitle = new Label
            {
                Text = "Dr. Ekrem Kasapoğlu Bilimsel Literatür & Tez Platformu",
                Font = new Font("Segoe UI", 9, FontStyle.Regular),
                ForeColor = Color.FromArgb(148, 163, 184), // Slate 400
                Location = new Point(22, 48),
                AutoSize = true
            };

            headerPanel.Controls.Add(lblTitle);
            headerPanel.Controls.Add(lblSubtitle);
            this.Controls.Add(headerPanel);

            // Status Panel
            Panel statusCard = new Panel
            {
                Location = new Point(20, 105),
                Size = new Size(405, 75),
                BackColor = Color.White
            };
            statusCard.Paint += (s, e) =>
            {
                ControlPaint.DrawBorder(e.Graphics, statusCard.ClientRectangle, 
                    Color.FromArgb(226, 232, 240), ButtonBorderStyle.Solid);
            };

            lblStatus = new Label
            {
                Text = "⏳ Sistem başlatılıyor, lütfen bekleyiniz...",
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                ForeColor = Color.FromArgb(71, 85, 105),
                Location = new Point(15, 15),
                AutoSize = true
            };

            LinkLabel linkUrl = new LinkLabel
            {
                Text = AppUrl,
                Font = new Font("Segoe UI", 9, FontStyle.Regular),
                Location = new Point(17, 42),
                AutoSize = true
            };
            linkUrl.LinkClicked += (s, e) => OpenInBrowser();

            statusCard.Controls.Add(lblStatus);
            statusCard.Controls.Add(linkUrl);
            this.Controls.Add(statusCard);

            // Open in Browser Button
            btnOpenBrowser = new Button
            {
                Text = "🚀 Tarayıcıda Aç",
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                ForeColor = Color.White,
                BackColor = Color.FromArgb(13, 148, 136), // Emerald/Teal 600
                FlatStyle = FlatStyle.Flat,
                Location = new Point(20, 195),
                Size = new Size(250, 42),
                Cursor = Cursors.Hand,
                Enabled = false
            };
            btnOpenBrowser.FlatAppearance.BorderSize = 0;
            btnOpenBrowser.Click += (s, e) => OpenInBrowser();
            this.Controls.Add(btnOpenBrowser);

            // Stop & Exit Button
            btnStop = new Button
            {
                Text = "🛑 Durdur ve Çık",
                Font = new Font("Segoe UI", 9, FontStyle.Regular),
                ForeColor = Color.FromArgb(100, 116, 139),
                BackColor = Color.FromArgb(241, 245, 249),
                FlatStyle = FlatStyle.Flat,
                Location = new Point(280, 195),
                Size = new Size(145, 42),
                Cursor = Cursors.Hand
            };
            btnStop.FlatAppearance.BorderColor = Color.FromArgb(203, 213, 225);
            btnStop.Click += (s, e) =>
            {
                if (MessageBox.Show("KlinikPusula platformunu kapatmak istiyor musunuz?", 
                    "Programı Kapat", MessageBoxButtons.YesNo, MessageBoxIcon.Question) == DialogResult.Yes)
                {
                    CloseApplication();
                }
            };
            this.Controls.Add(btnStop);

            // Footer info
            Label lblFooter = new Label
            {
                Text = "Python veya harici kurulum gerektirmez. Taşınabilir (Portable) Sürüm.",
                Font = new Font("Segoe UI", 8, FontStyle.Regular),
                ForeColor = Color.FromArgb(148, 163, 184),
                Location = new Point(20, 250),
                AutoSize = true
            };
            this.Controls.Add(lblFooter);

            // Setup Tray Icon
            SetupTray(icoPath);

            // Handle Minimize to Tray
            this.Resize += (s, e) =>
            {
                if (this.WindowState == FormWindowState.Minimized)
                {
                    this.Hide();
                    if (trayIcon != null)
                    {
                        trayIcon.ShowBalloonTip(2000, "KlinikPusula", 
                            "Arka planda çalışıyor. Tepsiden açabilirsiniz.", ToolTipIcon.Info);
                    }
                }
            };

            this.FormClosing += (s, e) =>
            {
                if (e.CloseReason == CloseReason.UserClosing)
                {
                    // Minimize to tray on X
                    e.Cancel = true;
                    this.WindowState = FormWindowState.Minimized;
                    this.Hide();
                    if (trayIcon != null)
                    {
                        trayIcon.ShowBalloonTip(2000, "KlinikPusula", 
                            "Arka planda çalışmaya devam ediyor. Tamamen kapatmak için simgeye sağ tıklayıp 'Çıkış'ı seçiniz.", ToolTipIcon.Info);
                    }
                }
            };
        }

        private void SetupTray(string icoPath)
        {
            trayMenu = new ContextMenu();
            trayMenu.MenuItems.Add("🚀 KlinikPusula'yı Aç", (s, e) =>
            {
                RestoreWindow();
                OpenInBrowser();
            });
            trayMenu.MenuItems.Add("📊 Durum Penceresi", (s, e) => RestoreWindow());
            trayMenu.MenuItems.Add("-");
            trayMenu.MenuItems.Add("🛑 Programı Kapat ve Çık", (s, e) => CloseApplication());

            Icon icon = this.Icon ?? SystemIcons.Application;
            trayIcon = new NotifyIcon
            {
                Text = "KlinikPusula — Dr. Ekrem Kasapoğlu",
                Icon = icon,
                ContextMenu = trayMenu,
                Visible = true
            };

            trayIcon.DoubleClick += (s, e) =>
            {
                RestoreWindow();
                OpenInBrowser();
            };
        }

        private void RestoreWindow()
        {
            this.Show();
            this.WindowState = FormWindowState.Normal;
            this.BringToFront();
        }

        private void StartServer()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            string nodeExe = Path.Combine(baseDir, "bin", "node.exe");
            if (!File.Exists(nodeExe))
            {
                nodeExe = FindInPath("node.exe");
            }

            string serverScript = Path.Combine(baseDir, "server", "server.js");

            if (string.IsNullOrEmpty(nodeExe) || !File.Exists(nodeExe))
            {
                lblStatus.Text = "❌ Node.js çalışma motoru bulunamadı!";
                lblStatus.ForeColor = Color.Red;
                return;
            }

            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = nodeExe,
                    Arguments = "\"" + serverScript + "\"",
                    WorkingDirectory = baseDir,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                startInfo.EnvironmentVariables["PORT"] = AppPort.ToString();
                startInfo.EnvironmentVariables["NODE_ENV"] = "production";

                backendProcess = Process.Start(startInfo);

                // Start polling health
                pollTimer = new System.Windows.Forms.Timer();
                pollTimer.Interval = 400;
                pollTimer.Tick += (s, e) => CheckHealth();
                pollTimer.Start();
            }
            catch (Exception ex)
            {
                lblStatus.Text = "❌ Başlatma hatası: " + ex.Message;
                lblStatus.ForeColor = Color.Red;
            }
        }

        private void CheckHealth()
        {
            pollRetries++;
            try
            {
                var req = (HttpWebRequest)WebRequest.Create(AppUrl + "/api/health");
                req.Timeout = 500;
                using (var resp = (HttpWebResponse)req.GetResponse())
                {
                    if (resp.StatusCode == HttpStatusCode.OK)
                    {
                        pollTimer.Stop();
                        lblStatus.Text = "🟢 Sistem Aktif ve Çalışıyor";
                        lblStatus.ForeColor = Color.FromArgb(13, 148, 136); // Teal/Emerald
                        btnOpenBrowser.Enabled = true;

                        // Auto open browser on initial start
                        OpenInBrowser();
                    }
                }
            }
            catch { }

            if (pollRetries > 40)
            {
                pollTimer.Stop();
                lblStatus.Text = "⚠️ Port 3000 yanıt vermedi";
                lblStatus.ForeColor = Color.OrangeRed;
            }
        }

        private void OpenInBrowser()
        {
            try
            {
                Process.Start(new ProcessStartInfo(AppUrl) { UseShellExecute = true });
            }
            catch (Exception ex)
            {
                MessageBox.Show("Tarayıcı açılamadı:\n" + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }
        }

        private void CloseApplication()
        {
            if (pollTimer != null) { pollTimer.Stop(); pollTimer.Dispose(); }
            if (trayIcon != null) { trayIcon.Visible = false; trayIcon.Dispose(); }
            if (backendProcess != null && !backendProcess.HasExited)
            {
                try { backendProcess.Kill(); backendProcess.Dispose(); } catch { }
            }
            Environment.Exit(0);
        }

        private static string FindInPath(string filename)
        {
            string pathEnv = Environment.GetEnvironmentVariable("PATH") ?? "";
            string[] dirs = pathEnv.Split(Path.PathSeparator);
            foreach (string d in dirs)
            {
                try
                {
                    string full = Path.Combine(d.Trim(), filename);
                    if (File.Exists(full)) return full;
                }
                catch { }
            }
            return null;
        }

        [STAThread]
        static void Main()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            File.AppendAllText(Path.Combine(baseDir, "startup.log"), "[" + DateTime.Now + "] Main started!\n");

            AppDomain.CurrentDomain.UnhandledException += (s, e) =>
            {
                File.AppendAllText(Path.Combine(baseDir, "startup.log"),
                    "UnhandledException: " + e.ExceptionObject + "\n");
            };
            Application.ThreadException += (s, e) =>
            {
                File.AppendAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "crash.log"),
                    "ThreadException: " + e.Exception + "\n");
            };
            AppDomain.CurrentDomain.ProcessExit += (s, e) =>
            {
                File.AppendAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "crash.log"),
                    "ProcessExit! Stack:\n" + Environment.StackTrace + "\n");
            };

            try
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "Main: Application.Run cagriliyor\n");
                Application.Run(new MainForm());
                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "Main: Application.Run normal sonlandi\n");
            }
            catch (Exception ex)
            {
                File.AppendAllText(Path.Combine(baseDir, "startup.log"), "Main CATCH HATA: " + ex + "\n");
            }
        }
    }
}
