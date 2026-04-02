#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Video Mover Server
شغل هذا السكريبت مرة واحدة في Terminal وسيبقى يستمع للتطبيق
python3 video_mover_server.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import shutil
from pathlib import Path
from urllib.parse import unquote

PORT = 7777
ROOT_PATH = Path("/Volumes/dt/AI-ENGINEER")
DONE_FOLDER_NAME = "✅_منتهي"


class MoveHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            request_data = json.loads(body.decode('utf-8'))

            file_path = unquote(request_data.get('file', ''))
            action = request_data.get('action', 'move')

            if not file_path:
                self._respond(400, {'error': 'لم يتم تحديد ملف'})
                return

            video = ROOT_PATH / file_path

            if action == 'move':
                self._handle_move(video)
            elif action == 'check':
                self._handle_check(video)
            elif action == 'undo':
                self._handle_undo(video)
            elif action == 'list_done':
                self._handle_list_done(video)
            else:
                self._respond(400, {'error': f'إجراء غير معروف: {action}'})

        except json.JSONDecodeError:
            self._respond(400, {'error': 'JSON غير صالح'})
        except Exception as e:
            print(f"❌ خطأ: {e}")
            self._respond(500, {'error': str(e)})

    def _handle_move(self, video):
        if not video.exists():
            self._respond(404, {
                'error': 'الملف غير موجود',
                'path': str(video)
            })
            return

        done_folder = video.parent / DONE_FOLDER_NAME
        done_folder.mkdir(exist_ok=True)
        dest = done_folder / video.name

        if dest.exists():
            self._respond(409, {
                'error': 'الملف موجود بالفعل في مجلد المنتهي',
                'path': str(dest)
            })
            return

        shutil.move(str(video), str(dest))
        print(f"✅ تم نقل: {video.name}")
        print(f"   من: {video.parent}")
        print(f"   إلى: {dest}")

        self._respond(200, {
            'success': True,
            'message': 'تم نقل الملف بنجاح',
            'from': str(video),
            'to': str(dest)
        })

    def _handle_check(self, video):
        self._respond(200, {
            'exists': video.exists(),
            'path': str(video)
        })

    def _handle_undo(self, video):
        done_folder = video.parent / DONE_FOLDER_NAME
        done_file = done_folder / video.name

        if done_file.exists():
            shutil.move(str(done_file), str(video))
            print(f"↩️ تم إرجاع: {video.name}")
            self._respond(200, {
                'success': True,
                'message': 'تم إرجاع الملف'
            })
        else:
            self._respond(404, {'error': 'الملف غير موجود في مجلد المنتهي'})

    def _handle_list_done(self, video):
        done_folder = video.parent / DONE_FOLDER_NAME
        if done_folder.exists():
            files = [f.name for f in done_folder.iterdir() if f.is_file()]
            self._respond(200, {'files': files})
        else:
            self._respond(200, {'files': []})

    def _respond(self, code, response_data):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data, ensure_ascii=False).encode('utf-8'))

    def log_message(self, format, *args):
        pass


def main():
    print("=" * 50)
    print("🎯 Video Mover Server")
    print(f"📂 المسار الجذر: {ROOT_PATH}")
    print(f"📁 مجلد المنتهي: {DONE_FOLDER_NAME}")
    print(f"🌐 يعمل على: http://localhost:{PORT}")
    print("=" * 50)

    if not ROOT_PATH.exists():
        print(f"⚠️  تحذير: المسار {ROOT_PATH} غير موجود!")
        print("   تأكد من توصيل القرص الخارجي")
    else:
        print(f"✅ المسار موجود")

    print()
    print("⏳ في انتظار الأوامر من التطبيق...")
    print("   اضغط Ctrl+C للإيقاف")
    print()

    server = HTTPServer(('localhost', PORT), MoveHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 تم إيقاف السيرفر")
        server.server_close()


if __name__ == '__main__':
    main()
