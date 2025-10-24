import http.server
import socketserver
import sys
from pathlib import Path
import datetime

def get_timestamp():
    """获取格式化的时间戳"""
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    """简化的请求处理器，提供清晰的日志格式"""
    
    def log_request(self, code='-', size='-'):
        # 过滤掉对@vite/client的请求
        if hasattr(self, 'path') and '@vite/client' in self.path:
            return
        
        # 简单明了的日志格式
        path = self.path if hasattr(self, 'path') else "未知路径"
        print(f"{get_timestamp()} [{code}] {path}")
        sys.stdout.flush()  # 确保立即输出到终端
    
    def log_error(self, format, *args):
        # 过滤掉对@vite/client的错误
        if hasattr(self, 'path') and '@vite/client' in self.path:
            return
        # 包含路径信息的错误日志
        path = self.path if hasattr(self, 'path') else "未知路径"
        error_msg = format % args
        print(f"{get_timestamp()} [错误] {error_msg} - 路径: {path}")
        sys.stdout.flush()  # 确保立即输出到终端

# 获取当前目录
current_dir = Path(__file__).parent

# 设置端口
port = 8000
if len(sys.argv) > 1:
    try:
        port = int(sys.argv[1])
    except ValueError:
        print("无效的端口号，使用默认端口 8000")

# 启动服务器
try:
    # 不需要禁用默认方法，因为我们在自定义处理器中重写了它们
    
    # 设置地址和端口
    handler = SimpleHandler
    with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
        # 打印清晰的启动信息（使用Windows兼容的字符）
        print("-" * 50)
        print("KAT-Coder 开发服务器已启动")
        print(f"服务目录: {current_dir}")
        print(f"访问地址: http://localhost:{port}")
        print("按 Ctrl+C 停止服务器")
        print("-" * 50)
        print("请求日志:")
        print("-" * 30)
        
        # 启动服务
        httpd.serve_forever()

except KeyboardInterrupt:
    print("\n服务器已停止")
except Exception as e:
    print(f"服务器启动失败: {e}")
    sys.exit(1)