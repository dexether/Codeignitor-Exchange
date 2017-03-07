<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/* 
 * This class takes care of asset loading like CSS and JS files.
 * manual loading might result in duplicates. This library removes duplicates.
 * It also allowes for compressing local css or js files for both faster loading
 * and a means to discourage caching.
 */

/**
 * Asset Class
 *
 * @package		CodeIgniter
 * @subpackage	Libraries
 * @category	Simple asset library
 * @author		Rogier Bruggeman
 * @link		http://www.rogierbruggeman.nl
 */
class L_asset
{
    /**
     *
     * @var css array()
     */
    private $css = array();

    /**
     *
     * @var js array()
     */
    private $js = array();

    /**
     *
     * A file added with this function can be of two types: css and js
     * @param string $file
     * @param string $type
     */
    public function add($file,$type='js')
    {
        $array = $this->$type;
        if(substr($file,0,4) != 'http') 
        {
            if(!in_array(strtolower($file),$array)) $array[] = strtolower($file);
        }
        else 
        {
            if(!in_array($file,$array)) $array[] = $file;
        }
        $this->$type = $array;
    }

    /**
     * Return either a js or css file compressed.
     * Do not compres CDN files due to remote images or resources
     *
     * @return string
     */
    public function get_min($what)
    {
        #todo: CDN files mogen niet meegenomen worden ivm remote images
        if(!empty($this->$what))
        {
            $return = $this->get_cdn($what); //CDN files
            $ret = null;
            
            //folder /css/pmin /js/pmin
            $CI = get_instance();
            $the_uri = null;
            for($i=1;$i<=$CI->uri->total_segments();$i++)
            {
                $part = $CI->uri->segment($i);
                if(strpos($part, '%')) $part = urldecode($part);
                if(!is_numeric($part))
                {
                    $the_uri .= $part. '_';
                }
            }
            if($the_uri == '') $the_uri = 'member';
            
            //remove trailing _
            $the_uri = rtrim($the_uri,'_');
            $the_file =  $the_uri.'_'.ASSET_VERSION.'.'.$what;
            
            if(!file_exists(FCPATH.''. $what. '/pmin/'.$the_file))
            {
                foreach ($this->$what as $value)
                {
                    if(substr($value, 0, 2) !== '//' && strpos($value, 'mobiscroll') ==false) //account for //domain.com/whatever.xxx
                    {
                        if(strpos(basename($value),'.min.')===false)
                        {
                            $compress = 'compress_'.$what;
                            $ret .= $this->$compress(file_get_contents("$value"));
                            $ret .= "\n";
                        } 
                        else $ret .= file_get_contents($value)."\n";
                    }
                }
                //remove old file
                foreach (glob(FCPATH.''. $what. '/pmin/'. $the_uri.'_*.'. $what) as $filename) {
                    unlink($filename);
                }
                //write file
                file_put_contents(FCPATH.''. $what. '/pmin/'.$the_file, $ret);
            }
            if($what == 'css')
                return $return.'<link rel="stylesheet" href="'.base_url().'css/pmin/'.$the_file.'" type="text/css" />'. "\n";
            else return $return.'<script type="text/javascript" src="'.base_url().'js/pmin/'.$the_file.'"></script>';
        }
    }
    
    public function get_cdn($what)
    {
        if(!empty($this->$what))
        {
            $return = null;
            foreach ($this->$what as $value)
            {
                if(substr($value, 0, 2) == '//' || strpos($value, 'mobiscroll') !=false) //account for //domain.com/whatever.xxx
                {
                    
                    if($what == 'css')
                        $return .=  '<link rel="stylesheet" href="'.(strpos($value, 'mobiscroll')?'/':'').$value.'" type="text/css" />'. "\n";
                    else $return .= '<script type="text/javascript" src="'.(strpos($value, 'mobiscroll')?'/':'').$value.'"></script>'. "\n";
                }
            }
            
            return $return;
        }
    }
    
    public function compress_css($css)
    {
        $replace = array(
            "#/\*.*?\*/#s" => "",  // Strip C style comments.
            "#\s\s+#"      => " ", // Strip excess whitespace.
          );
          $search = array_keys($replace);
          $css = preg_replace($search, $replace, $css);

          $replace = array(
            ": "  => ":",
            "; "  => ";",
            " {"  => "{",
            " }"  => "}",
            ", "  => ",",
            "{ "  => "{",
            ";}"  => "}", // Strip optional semicolons.
            ",\n" => ",", // Don't wrap multiple selectors.
            "\n}" => "}", // Don't wrap closing braces.
            "} "  => "}\n", // Put each rule on it's own line.
          );
          $search = array_keys($replace);
          $css = str_replace($search, $replace, $css);

          return trim($css);
    }
    
    public function compress_js($js)
    {
        $replace = array(
            '#\'([^\n\']*?)/\*([^\n\']*)\'#' => "'\1/'+\'\'+'*\2'", // remove comments from ' strings
            '#\"([^\n\"]*?)/\*([^\n\"]*)\"#' => '"\1/"+\'\'+"*\2"', // remove comments from " strings
            '#/\*.*?\*/#s'            => "",      // strip C style comments
            '#[\r\n]+#'               => "\n",    // remove blank lines and \r's
            '#\n([ \t]*//.*?\n)*#s'   => "\n",    // strip line comments (whole line only)
            '#([^\\])//([^\'"\n]*)\n#s' => "\\1\n",
                                                  // strip line comments
                                                  // (that aren't possibly in strings or regex's)
            '#\n\s+#'                 => "\n",    // strip excess whitespace
            '#\s+\n#'                 => "\n",    // strip excess whitespace
            '#(//[^\n]*\n)#s'         => "\\1\n", // extra line feed after any comments left
                                                  // (important given later replacements)
            '#/([\'"])\+\'\'\+([\'"])\*#' => "/*" // restore comments in strings
          );

          $search = array_keys( $replace );
          $js = preg_replace( $search, $replace, $js );

          $replace = array(
            "&&\n" => "&&",
            "||\n" => "||",
            "(\n"  => "(",
            ")\n"  => ")",
            "[\n"  => "[",
            "]\n"  => "]",
            "+\n"  => "+",
            ",\n"  => ",",
            "?\n"  => "?",
            ":\n"  => ":",
            ";\n"  => ";",
            "{\n"  => "{",
        //  "}\n"  => "}", (because I forget to put semicolons after function assignments)
            "\n]"  => "]",
            "\n)"  => ")",
            "\n}"  => "}",
            "\n\n" => "\n"
          );

          $search = array_keys( $replace );
          $js = str_replace( $search, $replace, $js );

          return trim( $js );
    }

    /**
     * Return a string with all loaded css files.
     *
     * @return string
     */
    public function get_css()
    {
        if(!empty($this->css))
        {
            $css = null;

            foreach ($this->css as $value)
            {
                $css .= '<link rel="stylesheet" href="'.(substr($value, 0, 2) == '//'?'':base_url()).$value.'" type="text/css" />'. "\n";
            }
            return $css;
        }
    }

    /**
     *
     * Return a string with all loaded js files.
     *
     * @return string
     */
    public function get_js()
    {
        if(!empty($this->js))
        {
            $js = null;

            foreach ($this->js as $value)
            {
                if(substr($value,0,4) == 'http') $js .= '<script type="text/javascript" src="'.$value.'"></script>'. "\n";
                else $js .= '<script type="text/javascript" src="'.(substr($value, 0, 2) == '//'?'':base_url()).$value.'"></script>'. "\n";
            }
            return $js;
        }
    }
}
