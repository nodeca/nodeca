#!/usr/bin/env ruby


PROJECT_NAME="nodeca"
GITHUB_NAME="nodeca/nodeca"


################################################################################
##  !!!  DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING  !!!  ##
################################################################################


begin
  require 'pdoc'
rescue LoadError
  puts "\nIn order to build docs, you need to have `pdoc` installed. Just run:\n"
  puts "\n $ gem install pdoc\n"
  puts "\nand you should be all set.\n\n"
  exit
end


begin
  require 'json'
rescue LoadError
  puts "\nIn order to build docs, you need to have `json` installed. Just run:\n"
  puts "\n $ gem install json\n"
  puts "\nand you should be all set.\n\n"
  exit
end


module PDocHelper
  require 'fileutils'
  extend FileUtils::Verbose


  DOC_DIR = ENV['DOC_DIR'] || File.join(Dir.pwd, 'doc')
  SYNTAX_HIGHLIGHTERS = [:pygments, :coderay, :none]

  
  def self.build_docs
    rm_rf(DOC_DIR)
    mkdir_p(DOC_DIR)

    current_head = self.current_head

    PDoc.run({
      :source_files => Dir[File.join('lib', '**', '*.js')],
      :destination => DOC_DIR,
      :index_page => 'README.md',
      :syntax_highlighter => syntax_highlighter,
      :markdown_parser => :bluecloth,
      :src_code_text => "View source on GitHub &rarr;",
      :src_code_href => proc { |obj|
        "https://github.com/#{GITHUB_NAME}/blob/#{current_head}/#{obj.file}#L#{obj.line_number}"
      },
      :timestamp => false,
      :pretty_urls => false,
      :bust_cache => true,
      :name => PROJECT_NAME,
      :version => version
    })
  end


  def self.show_revision?
    /^(1|y(es)?|true)$/i =~ ENV['SHOW_REVISION']
  end


  def self.version
    ver = JSON.parse(IO.read('./package.json'))['version']
    ver << '-' << current_head if show_revision?
    return ver
  end
 

  def self.syntax_highlighter
    if ENV['SYNTAX_HIGHLIGHTER']
      highlighter = ENV['SYNTAX_HIGHLIGHTER'].to_sym
      require_highlighter(highlighter, true)
      return highlighter
    end
    
    SYNTAX_HIGHLIGHTERS.detect { |n| require_highlighter(n) }
  end
  

  def self.require_highlighter(name, verbose=false)
    case name
    when :pygments
      success = system("pygmentize -V > /dev/null")
      if !success && verbose
        puts "\nYou asked to use Pygments, but I can't find the 'pygmentize' binary."
        puts "To install, visit:\n"
        puts " http://pygments.org/docs/installation/\n\n"
        exit
      end
      return success # (we have pygments)
    when :coderay
      begin
        require 'coderay'
      rescue LoadError => e
        if verbose
          puts "\nYou asked to use CodeRay, but I can't find the 'coderay' gem. Just run:\n\n"
          puts " $ gem install coderay"
          puts "\nand you should be all set.\n\n"
          exit
        end
        return false
      end
      return true # (we have CodeRay)
    when :none
      return true
    else
      puts "\nYou asked to use a syntax highlighter I don't recognize."
      puts "Valid options: #{SYNTAX_HIGHLIGHTERS.join(', ')}\n\n"
      exit
    end
  end
 

  def self.current_head
    `git show-ref --hash HEAD`.chomp[0..6]
  end
end


PDocHelper.build_docs


# vim:ts=2:sw=2
