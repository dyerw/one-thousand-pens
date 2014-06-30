from setuptools import setup, find_packages

setup(name='tbd',
      version='0.001',
      description='communal storytelling site',
      author='Some dudes',
      package_dir={'':'src'},
      packages=find_packages('src'),
      install_requires=[
          'sqlalchemy',
          'flask',
          'flask-sqlalchemy',
          'flask-restful',
          'flask-socketio'
      ],
      test_suite='tests'
     )